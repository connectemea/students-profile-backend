const userType = {
  student: 1,
  teacher: 2,
  admin: 3,
};
const checkUserHavePermission = (permitedUser, givenUser) =>
  Object.keys(userType).includes(givenUser) &&
  userType[givenUser] >= userType[permitedUser]
    ? false
    : true;

module.exports = {
  checkUserHavePermission,
};
