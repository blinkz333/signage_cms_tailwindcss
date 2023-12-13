import React, { useState, useEffect } from "react";
import User from "../libs/admin";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import add_new_img from "../assets/img/add_new_brand.png";
import { Navbar } from "../components";
import New_Account from "../components/New_Account";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const mock_data = {
  1: {
    name: "TEST",
    lastname: "ONE",
    img: `https://ui-avatars.com/api/?name=${"Test"}+${"One"}&background=${getRandomColor()}&color=fff`,
    des: "A1 Description",
  },
  2: {
    name: "TEST",
    lastname: "TWO",
    img: `https://ui-avatars.com/api/?name=${"Test"}+${"Two"}&background=${getRandomColor()}&color=fff`,
    des: "A2 Description",
  },
  3: {
    name: "TEST",
    lastname: "THREE",
    img: `https://ui-avatars.com/api/?name=${"Test"}+${"Three"}&background=${getRandomColor()}&color=fff`,
    des: "A3 Description",
  },
};

const User_Account = () => {
  const { user } = User.getCookieData();
  const navigate = useNavigate();
  const select_campaign = User.getCampaign();
  const select_account = User.getAccount();

  const [account, setAccount] = useState([]);
  const [showModalAddNewAccount, setShowModalAddNewAccount] = useState(false);

  useEffect(() => {
    const user = User.getCookieData();

    if (!user) {
      cookie.remove("signage-brand");
      cookie.remove("signage-account");
      window.location.href = "/adsmanager";
    }

    if (select_account) {
      navigate("/brand");
    }

    if (select_campaign) {
      navigate("/dashboard");
    }

    fetchData();

    // user.account = [1, 2];
    // setAccount(user.account);
  }, []);

  const fetchData = async () => {
    const { token } = User.getCookieData();

    try {
      const data = await User.getUserAccount(token);
      setAccount(data);
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const selectAccount = (account_id) => {
    const status = User.saveSelectedAccount(account_id);
    if (status) {
      navigate("/brand");
    } else {
      console.log("error select account");
    }
  };

  return (
    <>
      <Navbar />
      <div className="m-1 md:m-5 mt-24 p-2 md:p-5 bg-white rounded-3xl">
        <div className="text-6xl font-[700] text-center font-poppins">
          Select Your Account
        </div>
        <div className="text-xl text-center text-slate-500 mb-20 font-poppins font-[500]">
          Choose your account from the list to access account
        </div>

        <div className="flex flex-wrap justify-center items-center lg:space-x-[-100px]">
          <div className="w-full sm:w-3/4 lg:w-1/4 h-[400px] p-2 flex justify-center items-center">
            <button
              onClick={() => setShowModalAddNewAccount(!showModalAddNewAccount)}
            >
              <img
                className="block ml-auto mr-auto mt-30px w-4/5 rounded-3xl"
                src={add_new_img}
                alt={"Add New Account"}
              />
              <div className="font-bold text-[20px] m-auto w-[70%] text-center mt-[10px] font-poppins">
                Add New Account
              </div>
            </button>
          </div>
          {account.length > 0 &&
            account.map((items, key) => (
              <div
                key={key}
                className="w-full sm:w-3/4 lg:w-1/4 h-[400px] p-2 flex justify-center items-center"
              >
                <button onClick={() => selectAccount(items)}>
                  <img
                    className="block ml-auto mr-auto mt-30px w-[250px] h-[250px] rounded-3xl"
                    src={`https://ui-avatars.com/api/?name=${
                      items.AccountName
                    }&background=${getRandomColor()}&color=fff`}
                    alt={items.AccountName}
                  />
                  <div className="font-bold text-[20px] m-auto w-[100%] text-center mt-[10px] font-poppins">
                    {/* {`${mock_data[items].name} ${mock_data[items].lastname}`} */}
                    {items.AccountName}
                  </div>
                  <div className="text-[14px] text-slate-500 m-auto w-[70%] font-poppins">
                    {items.AccountCode}
                  </div>
                </button>
              </div>
            ))}
        </div>
      </div>

      {showModalAddNewAccount && (
        <a
          onClick={() => setShowModalAddNewAccount(!showModalAddNewAccount)}
          className="fixed top-0 w-screen left-[0px] h-screen opacity-80 bg-black z-10 backdrop-blur"
        />
      )}

      {showModalAddNewAccount && (
        <New_Account setShowModalAddNewAccount={setShowModalAddNewAccount} />
      )}
    </>
  );
};

export default User_Account;
