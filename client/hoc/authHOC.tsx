import React from "react";
import { useRecoilState } from "recoil";
import { userState } from "@/atoms/user";
import { useRouter } from "next/router";

const authHOC = (Component: React.FC) => {
  return (props: any) => {
    const router = useRouter();
    const [user, setUser] = useRecoilState(userState);

    React.useEffect(() => {
      if (localStorage.getItem("user")) {
        setUser(JSON.parse(localStorage.getItem("user") || "{}") || {});
      }
    }, []);

    React.useEffect(() => {
      if (!user || !localStorage.getItem("user")) {
        router.push("/signup");
      }
    }, [user]);
    return <Component {...props} />;
  };
};

export default authHOC;
