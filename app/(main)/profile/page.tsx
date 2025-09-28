import SignupFormDemo from "@/components/signup-form-demo";
// import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import React from "react";

type Props = {};

const Profile = (props: Props) => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen"
      style={{
        backgroundImage: `radial-gradient(circle at 0.5px 0.5px, rgba(6,182,212,0.2) 1px,transparent 0)`,
        backgroundSize: "10px 10px",
        backgroundRepeat: "repeat",
      }}
    >
      {/* <BackgroundRippleEffect /> */}
      <div className="relative z-10">
        <SignupFormDemo />
      </div>
    </div>
  );
};

export default Profile;
