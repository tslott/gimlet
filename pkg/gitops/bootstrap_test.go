package gitops

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"testing"
)

func Test_parseRepoURL(t *testing.T) {
	host, owner, repo := ParseRepoURL("git@github.com:gimlet-io/gimlet-cli.git")
	if host != "github.com" {
		t.Errorf("Must parse host")
	}
	if owner != "gimlet-io" {
		t.Errorf("Must parse owner")
	}
	if repo != "gimlet-cli" {
		t.Errorf("Must parse repo")
	}
}

func Test_generateManifestWithoutControllerWithoutSingleEnv(t *testing.T) {
	dirToWrite, err := ioutil.TempDir("/tmp", "gimlet")
	defer os.RemoveAll(dirToWrite)
	if err != nil {
		t.Errorf("Cannot create directory")
		return
	}

	shouldGenerateController := false
	env := "staging"
	singleEnv := false
	shouldGenerateKustomizationAndRepo := true
	shouldGenerateDeployKey := true
	gitOpsRepoURL := "git@github.com:gimlet-io/test-repo.git"

	_, _, _, err = GenerateManifests(
		shouldGenerateController,
		env,
		singleEnv,
		dirToWrite,
		shouldGenerateKustomizationAndRepo,
		shouldGenerateDeployKey,
		gitOpsRepoURL,
		"",
	)
	if err != nil {
		t.Errorf("Cannot generate the manifest files, %s", err)
		return
	}

	fluxFile, _ := os.Stat(filepath.Join(dirToWrite, env, "flux", "flux.yaml"))
	if fluxFile != nil {
		t.Errorf("Should not generate flux.yaml")
	}

	_, err = os.Stat(filepath.Join(dirToWrite, env, "flux", "gitops-repo-gimlet-io-test-repo-staging.yaml"))
	if err != nil {
		t.Errorf("Should generate Kustomization")
	}

	_, err = os.Stat(filepath.Join(dirToWrite, env, "flux", "deploy-key-gimlet-io-test-repo-staging.yaml"))
	if err != nil {
		t.Errorf("Should generate deploy key")
	}
}

func Test_generateManifestWithoutControllerWithSingleEnv(t *testing.T) {
	dirToWrite, err := ioutil.TempDir("/tmp", "gimlet")
	defer os.RemoveAll(dirToWrite)
	if err != nil {
		t.Errorf("Cannot create directory")
		return
	}
	shouldGenerateController := false
	env := ""
	singleEnv := true
	shouldGenerateKustomizationAndRepo := true
	shouldGenerateDeployKey := true
	gitOpsRepoURL := "git@github.com:gimlet-io/gitops-staging-infra.git"

	_, _, _, err = GenerateManifests(
		shouldGenerateController,
		env,
		singleEnv,
		dirToWrite,
		shouldGenerateKustomizationAndRepo,
		shouldGenerateDeployKey,
		gitOpsRepoURL,
		"",
	)
	if err != nil {
		t.Errorf("Cannot generate the manifest files, %s", err)
		return
	}

	fluxFile, _ := os.Stat(filepath.Join(dirToWrite, "flux", "flux.yaml"))
	if fluxFile != nil {
		t.Errorf("Should not generate flux.yaml")
	}

	_, err = os.Stat(filepath.Join(dirToWrite, "flux", "gitops-repo-gimlet-io-gitops-staging-infra.yaml"))
	if err != nil {
		t.Errorf("Should generate Kustomization")
	}

	_, err = os.Stat(filepath.Join(dirToWrite, "flux", "deploy-key-gimlet-io-gitops-staging-infra.yaml"))
	if err != nil {
		t.Errorf("Should generate deploy key")
	}
}

func Test_generateManifestWithController(t *testing.T) {
	dirToWrite, err := ioutil.TempDir("/tmp", "gimlet")
	defer os.RemoveAll(dirToWrite)
	if err != nil {
		t.Errorf("Cannot create directory")
		return
	}

	shouldGenerateController := true
	env := "staging"
	singleEnv := false
	shouldGenerateKustomizationAndRepo := true
	shouldGenerateDeployKey := true
	gitOpsRepoURL := "git@github.com:gimlet/test-repo.git"

	_, _, _, err = GenerateManifests(
		shouldGenerateController,
		env,
		singleEnv,
		dirToWrite,
		shouldGenerateKustomizationAndRepo,
		shouldGenerateDeployKey,
		gitOpsRepoURL,
		"",
	)
	if err != nil {
		t.Errorf("Cannot generate manifest files, %s", err)
		return
	}

	_, err = os.Stat(filepath.Join(dirToWrite, env, "flux", "flux.yaml"))
	if err != nil {
		t.Errorf("Should generate flux.yaml")
	}
}

func Test_generateManifestWithoutKustomizationAndRepoWithoutDeployKey(t *testing.T) {
	dirToWrite, err := ioutil.TempDir("/tmp", "gimlet")
	defer os.RemoveAll(dirToWrite)
	if err != nil {
		t.Errorf("Cannot create directory")
		return
	}

	shouldGenerateController := false
	env := ""
	singleEnv := true
	shouldGenerateKustomizationAndRepo := false
	shouldGenerateDeployKey := false
	gitOpsRepoURL := "git@github.com:gimlet/test-repo.git"

	_, _, _, err = GenerateManifests(
		shouldGenerateController,
		env,
		singleEnv,
		dirToWrite,
		shouldGenerateKustomizationAndRepo,
		shouldGenerateDeployKey,
		gitOpsRepoURL,
		"",
	)
	if err != nil {
		t.Errorf("Cannot generate manifest files, %s", err)
		return
	}

	kustomizationFile, _ := os.Stat(filepath.Join(dirToWrite, "flux", "gitops-repo-gimlet-io-gitops-staging-infra.yaml"))
	if kustomizationFile != nil {
		t.Errorf("Should not generate Kustomization")
	}

	secretFile, _ := os.Stat(filepath.Join(dirToWrite, "flux", "deploy-key-gimlet-io-gitops-staging-infra.yaml"))
	if secretFile != nil {
		t.Errorf("Should not generate deploy key")
	}
}

func Test_generateManifestWithKustomizationAndRepoWithoutDeployKey(t *testing.T) {
	dirToWrite, err := ioutil.TempDir("/tmp", "gimlet")
	defer os.RemoveAll(dirToWrite)
	if err != nil {
		t.Errorf("Cannot create directory")
		return
	}

	shouldGenerateController := false
	env := ""
	singleEnv := true
	shouldGenerateKustomizationAndRepo := true
	shouldGenerateDeployKey := false
	gitOpsRepoURL := "git@github.com:gimlet-io/gitops-staging-infra.git"

	_, _, _, err = GenerateManifests(
		shouldGenerateController,
		env,
		singleEnv,
		dirToWrite,
		shouldGenerateKustomizationAndRepo,
		shouldGenerateDeployKey,
		gitOpsRepoURL,
		"",
	)
	if err != nil {
		t.Errorf("Cannot generate manifest files, %s", err)
		return
	}

	_, err = os.Stat(filepath.Join(dirToWrite, "flux", "gitops-repo-gimlet-io-gitops-staging-infra.yaml"))
	if err != nil {
		t.Errorf("Should generate Kustomization")
	}

	secretFile, _ := os.Stat(filepath.Join(dirToWrite, "flux", "deploy-key-gimlet-io-gitops-staging-infra.yaml"))
	if secretFile != nil {
		t.Errorf("Should not generate deploy key")
	}
}

func Test_generateManifestProviderAndAlert(t *testing.T) {
	dirToWrite, err := ioutil.TempDir("/tmp", "gimlet")
	defer os.RemoveAll(dirToWrite)
	if err != nil {
		t.Errorf("Cannot create directory")
		return
	}

	env := "staging"
	targetPath := ""
	singleEnv := false
	gitOpsRepoURL := "git@github.com:gimlet-io/gitops-staging-infra.git"
	gimletdUrl := "https://gimletd.test.io"
	token := "mySecretToken123"

	_, err = GenerateManifestProviderAndAlert(
		env,
		targetPath,
		singleEnv,
		dirToWrite,
		gitOpsRepoURL,
		gimletdUrl,
		token,
	)
	if err != nil {
		t.Errorf("Cannot generate manifest files, %s", err)
		return
	}
}
