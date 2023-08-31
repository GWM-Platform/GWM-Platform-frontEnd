const calculateTotalAvailable = (account) => account?.balance + (account?.overdraft ?? 0)

const enrichAccount = (account) => ({
  ...account,
  ownFunds: account?.balance < 0 ? 0 : account?.balance,
  totalAvailable: calculateTotalAvailable(account),
  totalOverdraft: account?.overdraft ?? 0,
  hasOverdraft: !!(account?.overdraft !== 0),
  owed: account?.balance < 0 ? Math.abs(account?.balance) : 0,
  overdraftAvailable: account?.balance < 0
    ? (account?.overdraft + account?.balance)
    : (account?.overdraft ?? 0)
})

export default enrichAccount
