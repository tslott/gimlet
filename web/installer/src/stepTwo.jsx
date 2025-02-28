import { useEffect, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { Switch } from '@headlessui/react'
import { SeparateEnvironments } from 'shared-components';

const StepTwo = ({ getContext }) => {
  const [context, setContext] = useState(null);
  const [env, setEnv] = useState('production');
  const [email, setEmail] = useState('');
  const [repoPerEnv, setRepoPerEnv] = useState(false);
  const [useExistingPostgres, setUseExistingPostgres] = useState(false);
  const [hostAndPort, setHostAndPort] = useState('postgresql:5432');
  const [dashboardDb, setDashboardDb] = useState('gimlet_dashboard');
  const [dashboardUsername, setDashboardUsername] = useState('gimlet_dashboard');
  const [dashboardPassword, setDashboardPassword] = useState('');
  const [gimletdDb, setGimletdDb] = useState('gimletd');
  const [gimletdUsername, setGimletdUsername] = useState('gimletd');
  const [gimletdPassword, setGimletPassword] = useState('');
  const [infra, setInfra] = useState('gitops-infra');
  const [apps, setApps] = useState('gitops-apps');

  useEffect(() => {
    getContext().then(data => setContext(data))
      .catch(err => {
        console.error(`Error: ${err}`);
      });
  }, [getContext]);

  useEffect(() => {
    if (repoPerEnv) {
      setInfra(`gitops-${env}-infra`);
      setApps(`gitops-${env}-apps`);
    } else {
      setInfra(`gitops-infra`);
      setApps(`gitops-apps`);
    }
  }, [repoPerEnv, env]);

  if (!context) {
    return null;
  }

  return (
    <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-12">Gimlet Installer</h2>
          </div>
        </div>
        <nav aria-label="Progress">
          <ol className="border border-gray-300 rounded-md divide-y divide-gray-300 md:flex md:divide-y-0">
            <li className="relative md:flex-1 md:flex">
              {/* <!-- Completed Step --> */}
              <div className="group flex items-center w-full select-none cursor-default">
                <span className="px-6 py-4 flex items-center text-sm font-medium">
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full">
                    {/* <!-- Heroicon name: solid/check --> */}
                    <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                      fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-900">Create Github Application</span>
                </span>
              </div>

              {/* <!-- Arrow separator for lg screens and up --> */}
              <div className="hidden md:block absolute top-0 right-0 h-full w-5" aria-hidden="true">
                <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                  <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor"
                    strokeLinejoin="round" />
                </svg>
              </div>
            </li>

            <li className="relative md:flex-1 md:flex">
              {/* <!-- Current Step --> */}
              <div className="px-6 py-4 flex items-center text-sm font-medium select-none cursor-default" aria-current="step">
                <span
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-indigo-600 rounded-full">
                  <span className="text-indigo-600">02</span>
                </span>
                <span className="ml-4 text-sm font-medium text-indigo-600">Prepare gitops repository</span>
              </div>

              {/* <!-- Arrow separator for lg screens and up --> */}
              <div className="hidden md:block absolute top-0 right-0 h-full w-5" aria-hidden="true">
                <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                  <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor"
                    strokeLinejoin="round" />
                </svg>
              </div>
            </li>

            <li className="relative md:flex-1 md:flex">
              {/* <!-- Upcoming Step --> */}
              <div className="group flex items-center select-none cursor-default">
                <span className="px-6 py-4 flex items-center text-sm font-medium">
                  <span
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full">
                    <span className="text-gray-500 ">03</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-500 ">Bootstrap gitops automation</span>
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {context.appId === "" &&
          <div className="rounded-md bg-red-50 p-4 my-8">
            <div className="flex">
              <div className="flex-shrink-0">
                {/* <!-- Heroicon name: solid/x-circle --> */}
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">A Github Application was not yet created by the installer. Go
                  to <a href="/" className="font-bold">Step One</a> to create it.</h3>
              </div>
            </div>
          </div>
        }
        <form action="/bootstrap" method="post">
          <div className="mt-8 text-sm">
            <div className="mt-4 rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3 md:justify-between">
                  <p className="text-sm text-blue-500">
                    By default, infrastructure manifests of this environment will be placed in the <span
                      className="text-xs font-mono bg-blue-100 text-blue-500 font-medium px-1 py-1 rounded">{env}</span>
                    folder of the shared <span
                      className="text-xs font-mono bg-blue-100 font-medium text-blue-500 px-1 py-1 rounded">gitops-infra</span>
                    git repository,
                    and application manifests will be placed in the <span
                      className="text-xs font-mono bg-blue-100 text-blue-500 font-medium px-1 py-1 rounded">{env}</span>
                    folder of the shared <span
                      className="text-xs font-mono bg-blue-100 font-medium text-blue-500 px-1 py-1 rounded">gitops-apps</span>
                    git repository
                  </p>
                </div>
              </div>
            </div>

            <div className="text-gray-700">
              <div className="flex mt-4">
                <div className="font-medium self-center">Environment name</div>
                <div className="max-w-lg flex rounded-md ml-4">
                  <div className="max-w-lg w-full lg:max-w-xs">
                    <input id="apps" name="env"
                      value={env}
                      onChange={e => setEnv(e.target.value)}
                      className="block w-full p-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      type="text" />
                  </div>
                </div>
              </div>
              <div className="flex mt-4">
                <div className="font-medium self-center">Administrator email</div>
                <div className="max-w-lg flex rounded-md ml-4">
                  <div className="max-w-lg w-full lg:max-w-xs">
                    <input id="apps" name="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="block w-full p-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      type="text" />
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 leading-loose"></div>
            </div>
            <SeparateEnvironments
              repoPerEnv={repoPerEnv}
              setRepoPerEnv={setRepoPerEnv}
              infraRepo={infra}
              appsRepo={apps}
            />
            <input type="hidden" name="repoPerEnv" value={repoPerEnv} />
            <div className="flex mt-4">
              <div className="font-medium self-center">Use my existing Postgresql database</div>
              <div className="max-w-lg flex rounded-md ml-4">
                <Switch
                  checked={useExistingPostgres}
                  onChange={setUseExistingPostgres}
                  className={(
                    useExistingPostgres ? "bg-indigo-600" : "bg-gray-200") +
                    " relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                  }
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={(
                      useExistingPostgres ? "translate-x-5" : "translate-x-0") +
                      " pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    }
                  />
                </Switch>
                <input id="useExistingPostgres" name="useExistingPostgres"
                  value={useExistingPostgres}
                  onChange={e => setUseExistingPostgres(e.target.value)}
                  type="hidden" />
              </div>
            </div>
            <div className="text-sm text-gray-500 leading-loose">By default, a Postgresql database will be installed to store the Gimlet data
            </div>

            {useExistingPostgres &&
              <div className="ml-8">
                <div className="flex mt-4">
                  <div className="font-medium self-center">Host and port</div>
                  <div className="max-w-lg flex rounded-md ml-4">
                    <div className="max-w-lg w-full lg:max-w-xs">
                      <input id="hostAndPort" name="hostAndPort"
                        value={hostAndPort}
                        onChange={e => setHostAndPort(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        type="text" />
                    </div>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="font-medium self-center">Dashboard Database</div>
                  <div className="max-w-lg flex rounded-md ml-4">
                    <div className="max-w-lg w-full lg:max-w-xs">
                      <input id="dashboardDb" name="dashboardDb"
                        value={dashboardDb}
                        onChange={e => setDashboardDb(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        type="text" />
                    </div>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="font-medium self-center">Dashboard Username</div>
                  <div className="max-w-lg flex rounded-md ml-4">
                    <div className="max-w-lg w-full lg:max-w-xs">
                      <input id="dashboardUsername" name="dashboardUsername"
                        value={dashboardUsername}
                        onChange={e => setDashboardUsername(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        type="text" />
                    </div>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="font-medium self-center">Dashboard Password</div>
                  <div className="max-w-lg flex rounded-md ml-4">
                    <div className="max-w-lg w-full lg:max-w-xs">
                      <input id="dashboardPassword" name="dashboardPassword"
                        value={dashboardPassword}
                        onChange={e => setDashboardPassword(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        type="text" />
                    </div>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="font-medium self-center">GimletD Database</div>
                  <div className="max-w-lg flex rounded-md ml-4">
                    <div className="max-w-lg w-full lg:max-w-xs">
                      <input id="gimletdDb" name="gimletdDb"
                        value={gimletdDb}
                        onChange={e => setGimletdDb(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        type="text" />
                    </div>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="font-medium self-center">GimletD Username</div>
                  <div className="max-w-lg flex rounded-md ml-4">
                    <div className="max-w-lg w-full lg:max-w-xs">
                      <input id="gimletdUsername" name="gimletdUsername"
                        value={gimletdUsername}
                        onChange={e => setGimletdUsername(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        type="text" />
                    </div>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="font-medium self-center">GimletD Password</div>
                  <div className="max-w-lg flex rounded-md ml-4">
                    <div className="max-w-lg w-full lg:max-w-xs">
                      <input id="gimletdPassword" name="gimletdPassword"
                        value={gimletdPassword}
                        onChange={e => setGimletPassword(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        type="text" />
                    </div>
                  </div>
                </div>
              </div>
            }

            <div className="p-0 flow-root my-8">
              <span className="inline-flex rounded-md shadow-sm gap-x-3 float-right">
                <button
                  className="bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-indigo active:bg-green-700 inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white transition ease-in-out duration-150">
                  Prepare gitops repository
                </button>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>

  );
};

export default StepTwo;
