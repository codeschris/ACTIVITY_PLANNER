import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createActivity(activity) {
  return window.canister.planner.addActivity(activity);
}

export async function getActivities() {
  try {
    return await window.canister.planner.getActivities();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }

}

export async function getActivity(id){
  try {
    return await window.canister.planner.getActivity(id);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return {};
  }

}

export async function updateActivity(id,activity) {
  return window.canister.planner.updateActivity(id,activity);
}

export async function deleteActivity(id) {
  return window.canister.planner.deleteActivity(id);
}

export async function addTag(id, tag) {
  return window.canister.planner.addTag(id, tag);
}

export async function removeTag(id, tag) {
  return window.canister.planner.removeTag(id, tag);
}

export async function getActivitiesByTag(tag) {
  return window.canister.planner.getActivitiesByTag(tag);
}


export async function completeActivity(id) {
  return window.canister.planner.completeActivity(id);
}

export async function updateStatus(id, status) {
  return window.canister.planner.changeStatus(id, status);
}

export async function getActivitiesByStatus(status) {
  return window.canister.planner.getActivitiesByStatus(status);
}

export async function setPriority(id, priority) {
  return window.canister.planner.setPriority(id, priority);
}

export async function calculateElapsedTime(id) {
  return window.canister.planner.calculateElapsedTime(id);
}



export async function getActivityByAscendingOrder() {
  return window.canister.planner.getActivitiesByCreatedDate();
}

export async function getNoOfActivities() {
  return window.canister.planner.countActivities();
}

export async function payPremiumPlan(activity, premiumPlanPrice) {
  const plannerCanister = window.canister.planner;
  const orderResponse = await plannerCanister.createPremiumPlan(activity.id, premiumPlanPrice);
  const sellerPrincipal = Principal.from(orderResponse.Ok.reservor);
  const sellerAddress = await plannerCanister.getAddressFromPrincipal(sellerPrincipal);
  const block = await transferICP(sellerAddress, orderResponse.Ok.price, orderResponse.Ok.memo);
  await plannerCanister.completePremiumPlan(sellerPrincipal, activity.id, orderResponse.Ok.price, block, orderResponse.Ok.memo);
}










