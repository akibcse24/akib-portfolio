// Session context — tracks current user account (akib vs guest)
// All storage keys are namespaced by account to keep data separate.

export type AccountType = 'akib' | 'guest';

let currentAccount: AccountType = 'guest';

export function setCurrentAccount(account: AccountType) {
  currentAccount = account;
  sessionStorage.setItem('akibos-current-account', account);
}

export function getCurrentAccount(): AccountType {
  return currentAccount;
}

/** Returns a storage key namespaced by the current account */
export function accountKey(base: string): string {
  return `akibos-${currentAccount}-${base}`;
}

/** Returns a Supabase os_data key namespaced by account */
export function accountDataKey(base: string): string {
  return `${currentAccount}:${base}`;
}
