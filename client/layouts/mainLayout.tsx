import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userState } from "@/atoms/user";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";

interface ConversationType {
  name: string;
  id: string;
  current: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const MainLayout = ({
  passedConversations,
  currentConversation,
  children,
}: {
  children: React.ReactNode;
  passedConversations: any[];
  currentConversation: any;
}) => {
  const router = useRouter();

  const [user, setUser] = useRecoilState<any>(userState);

  // const [conversations, setConversations] = React.useState<ConversationType[]>([
  //   { name: "Conversation 1", id: "abc1", current: true },
  //   { name: "Conversation 2", id: "abc2", current: false },
  //   { name: "Conversation 3", id: "abc3", current: false },
  //   { name: "Conversation 4", id: "abc4", current: false },
  //   { name: "Conversation 5", id: "abc5", current: false },
  //   { name: "Conversation 6", id: "abc6", current: false },
  // ]);

  const [passedConversationsState, setPassedConversationsState] =
    React.useState<any[]>([]);

  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

  function signout() {
    localStorage.setItem("user", "");
    setUser({});
    router.reload();
  }

  React.useEffect(() => {
    passedConversations &&
      console.log("conversations from element: ", passedConversations);
    passedConversations &&
      passedConversations.map((item: any) => {
        console.log("iterated item name: ", item.name);
      });

    passedConversations && setPassedConversationsState(passedConversations);
  }, [passedConversations]);

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={React.Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={React.Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={React.Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={React.Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center">
                      <div>
                        JurisTech
                        {passedConversations &&
                          passedConversations.map((item: any) => {
                            return <p key={item.name}>{item.name}</p>;
                          })}
                      </div>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {passedConversationsState &&
                              passedConversationsState.map((item: any) => (
                                <li key={item.name}>
                                  <a
                                    href={`/conversations/${item.id}`}
                                    className={classNames(
                                      // item.name === currentConversation.name
                                      //   ? "bg-gray-50 text-gray-600"
                                      //   : "text-gray-500 hover:text-gray-600 hover:bg-gray-50",
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                </li>
                              ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-center">
              <p className="text-lg font-semibold text-blue-500">JurisTech</p>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {passedConversations &&
                      passedConversations.map((item: any) => (
                        <li
                          className={`flex items-center justify-between group hover:bg-gray-100 rounded-md 
                        ${
                          item.name == currentConversation.name
                            ? "bg-gray-100 text-gray-800"
                            : "text-gray-500"
                        }
                        `}
                          key={item.name}
                          // onClick={() => updateCurrentConversation(item.id)}
                        >
                          <a
                            href={`/conversations/${item.id}`}
                            className={classNames(
                              item.current
                                ? "bg-gray-100 group-hover:bg-gray-100 text-gray-800"
                                : "text-gray-500 hover:text-gray-800",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                            )}
                          >
                            {item.name}
                          </a>
                          {item.current && (
                            <div className="flex items-center gap-2 mx-2">
                              <button>
                                <PencilIcon
                                  className="h-4 w-4 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                              </button>
                              <button>
                                <TrashIcon
                                  className="h-4 w-4 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                  </ul>
                </li>

                <li className="-mx-6 mt-auto">
                  <a
                    href="#"
                    className="flex items-center justify-between gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                    <div className="flex gap-x-4 items-center">
                      <UserCircleIcon className="h-8 w-8 rounded-full bg-gray-50" />

                      <span className="sr-only">Your profile</span>
                      {user && (
                        <span aria-hidden="true">
                          {user.firstName + " " + user.lastName}
                        </span>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisHorizontalIcon className="h-6 w-6 focus:outline-none" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>Profile</DropdownMenuItem>
                        <DropdownMenuItem disabled>Billing</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => signout()}>
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </a>
                </li>
                {/* <div>
                  <li className="-mx-6 mt-auto">
                    <button>Signout</button>
                  </li>
                  <li className="-mx-6 mt-auto">
                    <a
                      href="#"
                      className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                    >
                      <img
                        className="h-8 w-8 rounded-full bg-gray-50"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <span className="sr-only">Your profile</span>
                      <span aria-hidden="true">Tom Cook</span>
                    </a>
                  </li>
                </div> */}
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            Dashboard
          </div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <img
              className="h-8 w-8 rounded-full bg-gray-50"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </a>
        </div>

        <main className="lg:pl-72">
          <div>{children}</div>
        </main>
      </div>
    </>
  );
};

export default MainLayout;
