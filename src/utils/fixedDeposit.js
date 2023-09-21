const isPending = (FixedDeposit) =>
  FixedDeposit?.stateId === 1 || FixedDeposit?.stateId === 5;

const getOriginalAnualRate = (FixedDeposit) => FixedDeposit?.interestRate;
const getEditedAnualRate = (FixedDeposit) => FixedDeposit?.newInterestRate;

const editedInterestRate = (FixedDeposit) =>
  getEditedAnualRate(FixedDeposit) !== 0 &&
  getEditedAnualRate(FixedDeposit) !== null &&
  getEditedAnualRate(FixedDeposit) !== getOriginalAnualRate(FixedDeposit);

const getAnualRate = (FixedDeposit) => getOriginalAnualRate(FixedDeposit);

const getOriginalDuration = (FixedDeposit) => FixedDeposit?.duration;
const getEditedDuration = (FixedDeposit) => FixedDeposit?.newDuration;
const editedDuration = (FixedDeposit) =>
  getEditedDuration(FixedDeposit) !== 0 &&
  getEditedDuration(FixedDeposit) !== null &&
  getEditedDuration(FixedDeposit) !== getOriginalDuration(FixedDeposit);

const getDuration = (FixedDeposit) => getOriginalDuration(FixedDeposit);
console.log(getDuration())
const wasEdited = (FixedDeposit) => {
  return FixedDeposit.motive==="BID_OFFER";
};

export {
  isPending,
  wasEdited,
  getOriginalAnualRate,
  getEditedAnualRate,
  editedInterestRate,
  getAnualRate,
  getOriginalDuration,
  getEditedDuration,
  editedDuration,
  getDuration,
};
