package gitops

import (
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"strings"
	"time"

	"github.com/fluxcd/flux2/pkg/manifestgen/install"
	"github.com/fluxcd/pkg/ssh"
	"github.com/gimlet-io/gimlet-cli/pkg/gitops/sync"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"sigs.k8s.io/yaml"
)

func GenerateManifests(
	shouldGenerateController bool,
	env string,
	singleEnv bool,
	gitopsRepoPath string,
	shouldGenerateKustomizationAndRepo bool,
	shouldGenerateDeployKey bool,
	gitopsRepoUrl string,
	branch string,
) (string, string, string, error) {
	var (
		publicKey          string
		gitopsRepoName     string
		gitopsRepoFileName string
		secretFileName     string
	)

	installOpts := install.MakeDefaultOptions()
	installOpts.ManifestFile = "flux.yaml"
	installOpts.TargetPath = env

	if !singleEnv && env == "" {
		return "", "", "", fmt.Errorf("either `--env` or `--single-env` is mandatory")
	}
	if singleEnv && env != "" {
		return "", "", "", fmt.Errorf("`--env` and `--single-env` are mutually exclusive")
	}

	if singleEnv {
		env = "."
	}

	if shouldGenerateController {
		installManifest, err := install.Generate(installOpts, "")
		if err != nil {
			return "", "", "", fmt.Errorf("cannot generate installation manifests %s", err)
		}
		installManifest.Path = path.Join(env, "flux", installOpts.ManifestFile)
		_, err = installManifest.WriteFile(gitopsRepoPath)
		if err != nil {
			return "", "", "", fmt.Errorf("cannot write installation manifests %s", err)
		}
	}

	if shouldGenerateKustomizationAndRepo {
		host, owner, repoName := ParseRepoURL(gitopsRepoUrl)

		gitopsRepoName = fmt.Sprintf("gitops-repo-%s", uniqueName(singleEnv, owner, repoName, env))
		gitopsRepoFileName = gitopsRepoName + ".yaml"
		secretName := fmt.Sprintf("deploy-key-%s", uniqueName(singleEnv, owner, repoName, env))
		secretFileName = secretName + ".yaml"

		syncOpts := sync.Options{
			Interval:     15 * time.Second,
			URL:          fmt.Sprintf("ssh://git@%s/%s/%s", host, owner, repoName),
			Name:         gitopsRepoName,
			Secret:       secretName,
			Namespace:    "flux-system",
			Branch:       branch,
			ManifestFile: gitopsRepoFileName,
		}

		syncOpts.TargetPath = env
		if singleEnv {
			syncOpts.TargetPath = ""
		}
		syncManifest, err := sync.Generate(syncOpts)
		if err != nil {
			return "", "", "", fmt.Errorf("cannot generate git manifests %s", err)
		}
		syncManifest.Path = path.Join(env, "flux", syncOpts.ManifestFile)
		_, err = syncManifest.WriteFile(gitopsRepoPath)
		if err != nil {
			return "", "", "", fmt.Errorf("cannot write git manifests %s", err)
		}

		err = os.MkdirAll(path.Join(gitopsRepoPath, env, "dependencies"), os.ModePerm)
		if err != nil {
			return "", "", "", fmt.Errorf("cannot create dependencies folder %s", err)
		}
		err = ioutil.WriteFile(path.Join(gitopsRepoPath, env, "dependencies", ".sourceignore"), []byte(""), os.ModePerm)
		if err != nil {
			return "", "", "", fmt.Errorf("cannot populate dependencies folder %s", err)
		}

		if shouldGenerateDeployKey {
			pKey, deployKeySecret, err := generateDeployKey(host, secretName)
			publicKey = pKey
			if err != nil {
				return "", "", "", fmt.Errorf("cannot generate deploy key %s", err)
			}
			err = ioutil.WriteFile(path.Join(gitopsRepoPath, env, "flux", secretFileName), deployKeySecret, os.ModePerm)
			if err != nil {
				return "", "", "", fmt.Errorf("cannot write deploy key %s", err)
			}
		}
	}

	return gitopsRepoFileName, publicKey, secretFileName, nil
}

func uniqueName(singleEnv bool, owner string, repoName string, env string) string {
	uniqueName := fmt.Sprintf("%s-%s-%s",
		strings.ToLower(owner),
		strings.ToLower(repoName),
		strings.ToLower(env),
	)
	if singleEnv {
		uniqueName = fmt.Sprintf("%s-%s",
			strings.ToLower(owner),
			strings.ToLower(repoName),
		)
	}
	return uniqueName
}

func GenerateManifestProviderAndAlert(
	env string,
	targetPath string,
	singleEnv bool,
	gitopsRepoPath string,
	gitopsRepoUrl string,
	gimletdUrl string,
	token string,
) (string, error) {
	_, owner, repoName := ParseRepoURL(gitopsRepoUrl)

	kustomizationName := fmt.Sprintf("gitops-repo-%s", uniqueName(singleEnv, owner, repoName, env))
	notificationsName := fmt.Sprintf("notifications-%s", uniqueName(singleEnv, owner, repoName, env))
	notificationsFileName := notificationsName + ".yaml"

	syncManifest, err := sync.GenerateProviderAndAlert(
		env,
		gimletdUrl,
		token,
		targetPath,
		kustomizationName,
		notificationsName,
		notificationsFileName,
	)
	if err != nil {
		return "", fmt.Errorf("cannot generate git manifests %s", err)
	}
	syncManifest.Path = path.Join(targetPath, "flux", notificationsFileName)
	_, err = syncManifest.WriteFile(gitopsRepoPath)
	if err != nil {
		return "", fmt.Errorf("cannot write git manifests %s", err)
	}

	return notificationsFileName, nil
}

func ParseRepoURL(url string) (string, string, string) {
	host := strings.Split(url, ":")[0]
	host = strings.Split(host, "@")[1]

	owner := strings.Split(url, ":")[1]
	owner = strings.Split(owner, "/")[0]

	repo := strings.Split(url, ":")[1]
	repo = strings.Split(repo, "/")[1]
	repo = strings.TrimSuffix(repo, ".git")

	return host, owner, repo
}

func generateDeployKey(host string, name string) (string, []byte, error) {
	privateKeyBytes, publicKeyBytes, err := GenerateEd25519()
	if err != nil {
		return "", []byte(""), err
	}

	hostKey, err := ssh.ScanHostKey(host+":22", 30*time.Second)
	if err != nil {
		return "", []byte(""), err
	}

	secret := corev1.Secret{
		TypeMeta: metav1.TypeMeta{
			APIVersion: "v1",
			Kind:       "Secret",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: "flux-system",
		},
		StringData: map[string]string{
			"identity":     string(privateKeyBytes),
			"identity.pub": string(publicKeyBytes),
			"known_hosts":  string(hostKey),
		},
	}

	yamlString, err := yaml.Marshal(secret)
	return string(publicKeyBytes), yamlString, err
}
