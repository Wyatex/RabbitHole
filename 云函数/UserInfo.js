module.exports = async function (params, context) {
  const user = await inspirecloud.user.current(context);
  return {
    success: true,
    user,
  };
};
