import { getCatalystApp } from "./catalyst";

function getUserManagement() {
  const app = getCatalystApp();
  return app.userManagement();
}

export async function login(email, password) {
  return getUserManagement().login({
    email_id: email,
    password,
  });
}

export async function getCurrentUser() {
  return getUserManagement().getCurrentUser();
}

export async function logout() {
  return getUserManagement().logout();
}