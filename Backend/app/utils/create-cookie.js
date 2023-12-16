export const cookieConfig = { httpOnly: true, secure: true, sameSite: "none" };

const createCookie = (res, token) => {
  console.log("####################", token);
  return res.cookie("work-wise", JSON.stringify({ token }), {
    expires: new Date(Date.now() + 86400000), // 1 day
    ...cookieConfig,
  });
};

export default createCookie;
