import { act } from "@testing-library/react";
import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import {
    Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

/**
 * This type represents a product that can be listed on a marketplace.
 * It contains basic properties that are needed to define a product.
 */
const Activity = Record({
    creator: Principal,
    id: text,
    title: text,
    description: text,
    elapsed_time: text,
    tags: Vec(text),
    status: text,
    priority: text,
    created_at: nat64,
    updated_at: Opt(nat64),
});

const ActivityPayload = Record({
    title: text,
    description: text,
});

const ReserveStatus = Variant({
    PaymentPending: text,
    Completed: text
});



// Stay with implementing Payment for Reserving 
const Premium = Record({
    ActivityId: text,
    price: nat64,
    status: ReserveStatus,
    reservor: Principal,
    paid_at_block: Opt(nat64),
    memo: nat64
});


const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    PaymentFailed: text,
    PaymentCompleted: text
});

const TIMEOUT_PERIOD = 5600n; // reservation period in seconds


const activityStorage = StableBTreeMap(0, text, Activity);
const persistedPlan = StableBTreeMap(1, Principal, Premium);
const pendingPlans = StableBTreeMap(2, nat64, Premium);


const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

const firstLoad = 2;

export default Canister({
    getActivities: query([], Vec(Activity), () => {
        return activityStorage.values();
    }),
    getActivity: query([text], Result(Activity, Message), (id) => {
        const activityOpt = activityStorage.get(id);
        if ("None" in activityOpt) {
            return Err({ NotFound: `activity with id=${id} not found` });
        }
        return Ok(activityOpt.Some);
    }),
    addActivity: update([ActivityPayload], Result(Activity, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ NotFound: "invalid payoad" })
        }

        const activity = { 
            id: uuidv4(), 
            creator: ic.caller(), 
            status: "pending",
            priority: "normal",
            tags:[], 
            elapsed_time: "0",
            created_at: ic.time(), 
            updated_at: None,
            ...payload };
        activityStorage.insert(activity.id, activity);
        return Ok(activity);
    }),

    // Add Tag to Activity
    addTag: update([text, text], Result(text, Message), (id, tag) => {
        const activityOpt = activityStorage.get(id);
        if ("None" in activityOpt) {
            return Err({ NotFound: `cannot add tag to activity: activity with id=${id} not found` });
        }

        if (activityOpt.Some.creator.toString() !== ic.caller().toString()) {
            return Err({ NotFound: `You are not authorized to add tag to this activity`});
        }
        const activity = activityOpt.Some;
        activity.tags.push(tag);
        activityStorage.insert(activity.id, activity);
        return Ok(tag);
    }),

    // Remove Tag from Activity
    removeTag: update([text, text], Result(text, Message), (id, tag) => {
        const activityOpt = activityStorage.get(id);
        if ("None" in activityOpt) {
            return Err({ NotFound: `cannot remove tag from activity: activity with id=${id} not found` });
        }
        const activity = activityOpt.Some;
        const index = activity.tags.indexOf(tag);
        if (index > -1) {
            activity.tags.splice(index, 1);
        }
        activityStorage.insert(activity.id, activity);
        return Ok(tag);
    }),

    // Get Activity by Tag 
    getActivitiesByTag: query([text], Vec(Activity), (tag) => {
        const activities = activityStorage.values();
        return activities.filter(activity => activity.tags.includes(tag));
    }),



    // Make a Completion of Activity
    completeActivity: update([text], Result(text, Message), (id) => {
        const activityOpt = activityStorage.get(id);
        if ("None" in activityOpt) {
            return Err({ NotFound: `cannot complete the activity: activity with id=${id} not found` });
        }
        const activity = activityOpt.Some;
        activity.status = "completed";
        activityStorage.insert(activity.id, activity);
        return Ok(activity.id);
    }),

    // Change the status of Activity
    changeStatus: update([text, text], Result(text, Message), (id, status) => {
        const activityOpt = activityStorage.get(id);
        if ("None" in activityOpt) {
            return Err({ NotFound: `cannot change the status of activity: activity with id=${id} not found` });
        }
        const activity = activityOpt.Some;
        activity.status = status;
        activityStorage.insert(activity.id, activity);
        return Ok(activity.id);
    }),

    // Get Activity by Status
    getActivitiesByStatus: query([text], Vec(Activity), (status) => {
        const activities = activityStorage.values();
        return activities.filter(activity => activity.status.toLowerCase() === status.toLowerCase());
    }),


    // Set Priority of Activity
    setPriority: update([text, text], Result(text, Message), (id, priority) => {
        const activityOpt = activityStorage.get(id);
        if ("None" in activityOpt) {
            return Err({ NotFound: `cannot set priority of activity: activity with id=${id} not found` });
        }
        const activity = activityOpt.Some;
        activity.priority = priority;
        activityStorage.insert(activity.id, activity);
        return Ok(activity.id);
    }),

    // Calculate Elapsed Time of Activity
    calculateElapsedTime: update([text], text, (id) => {
        const activityOpt = activityStorage.get(id);
        if ("None" in activityOpt) {
            return "0";
        }
        const activity = activityOpt.Some;

        const time = Math.floor((Number(ic.time()) - Number(activityOpt.Some.created_at)) / 60000000000);
        // This can be upgraded to calculate even for hours for test purpose we use minutes
        // console.log ((Number(ic.time()) - Number(activityOpt.Some.created_at)) / 60000000000);
        activity.elapsed_time = time.toString();
        activityStorage.insert(activity.id, activity);
        return activity.elapsed_time;
    } ),
    
   
    // Arrange Activities by Created Date in Ascending Order
    getActivitiesByCreatedDate: query([], Vec(Activity), () => {
        const activities = activityStorage.values();
        return activities.sort((a, b) => Number(a.created_at) - Number(b.created_at));
    }),

    // Count Activities in the Storage
    countActivities: query([], nat64, () => {
        return activityStorage.len();
    }),

    
    updateActivity: update([text,ActivityPayload], Result(Activity, Message), (id,payload) => {
        const activityOpt = activityStorage.get(id);
        if ("None" in activityOpt) {
            return Err({ NotFound: `cannot update the activity: activity with id=${id} not found` });
        }
        const activity = activityOpt.Some;
        activity.creator = activity.creator;
        activity.title = payload.title;
        activity.description = payload.description;
        activity.tags = activity.tags;
        activity.status = activity.status;
        activity.priority = activity.priority;
        activity.elapsed_time = activity.elapsed_time;
        activity.created_at = activity.created_at;
        activity.updated_at = Some(ic.time());
        activityStorage.insert(activity.id, activity);
        return Ok(activity);
    }),
    deleteActivity: update([text], Result(text, Message), (id) => {
        const deletedActivityOpt = activityStorage.remove(id);
        if ("None" in deletedActivityOpt) {
            return Err({ NotFound: `cannot delete the activity: activity with id=${id} not found` });
        }
        return Ok(deletedActivityOpt.Some.id);
    }),

    createPremiumPlan: update([text, nat64], Result(Premium, Message), (activityId, premiumPlanPrice) => {
        const activityOpt = activityStorage.get(activityId);
        if ("None" in activityOpt) {
            return Err({ NotFound: `cannot reserve book: book with id=${activityId} not found` });
        }

        const activity = activityOpt.Some;
        const plan = {
            ActivityId: activity.id,
            price: premiumPlanPrice,
            status: { PaymentPending: "PAYMENT_PENDING" },
            reservor: activity.creator,
            paid_at_block: None,
            memo: generateCorrelationId(activityId)
        };
        pendingPlans.insert(plan.memo, plan);
        discardByTimeout(plan.memo, TIMEOUT_PERIOD);
        return Ok(plan);
    }
    ),

    completePremiumPlan: update([Principal,text,nat64, nat64, nat64], Result(Premium, Message), async (reservor,activityId,premiumPlanPrice, block, memo) => {
        const paymentVerified = await verifyPaymentInternal(reservor,premiumPlanPrice, block, memo);
        if (!paymentVerified) {
            return Err({ NotFound: `cannot complete the reserve: cannot verify the payment, memo=${memo}` });
        }
        const pendingPlansOpt = pendingPlans.remove(memo);
        if ("None" in pendingPlansOpt) {
            return Err({ NotFound: `cannot complete the reserve: there is no pending reserve with id=${activityId}` });
        }
        const plans = pendingPlansOpt.Some;
        const updatedPlan = { ...plans, status: { Completed: "COMPLETED" }, paid_at_block: Some(block) };
        const activityOpt = activityStorage.get(activityId);
        if ("None" in activityOpt) {
            return Err({ NotFound: `cannot complete the reserve: activity with id=${activityId} not found` });
        }
        const activity = activityOpt.Some;
        activity.status = "premium";
        activityStorage.insert(activity.id, activity);
        persistedPlan.insert(ic.caller(), updatedPlan);
        return Ok(updatedPlan);
    }
    ),

     /*
        another example of a canister-to-canister communication
        here we call the `query_blocks` function on the ledger canister
        to get a single block with the given number `start`.
        The `length` parameter is set to 1 to limit the return amount of blocks.
        In this function we verify all the details about the transaction to make sure that we can mark the order as completed
    */
    verifyPayment: query([Principal, nat64, nat64, nat64], bool, async (receiver, amount, block, memo) => {
        return await verifyPaymentInternal(receiver, amount, block, memo);
    }),

    /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
    getAddressFromPrincipal: query([Principal], text, (principal) => {
        return hexAddressFromPrincipal(principal, 0);
    }),

});

/*
    a hash function that is used to generate correlation ids for orders.
    also, we use that in the verifyPayment function where we check if the used has actually paid the order
*/
function hash(input: any): nat64 {
    return BigInt(Math.abs(hashCode().value(input)));
};


// a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};

// HELPER FUNCTIONS
function generateCorrelationId(bookId: text): nat64 {
    const correlationId = `${bookId}_${ic.caller().toText()}_${ic.time()}`;
    return hash(correlationId);
};

/*
    after the order is created, we give the `delay` amount of minutes to pay for the order.
    if it's not paid during this timeframe, the order is automatically removed from the pending orders.
*/
function discardByTimeout(memo: nat64, delay: Duration) {
    ic.setTimer(delay, () => {
        const order = pendingPlans.remove(memo);
        console.log(`Reserve discarded ${order}`);
    });
};

async function verifyPaymentInternal(receiver: Principal, amount: nat64, block: nat64, memo: nat64): Promise<bool> {
    const blockData = await ic.call(icpCanister.query_blocks, { args: [{ start: block, length: 1n }] });
    const tx = blockData.blocks.find((block) => {
        if ("None" in block.transaction.operation) {
            return false;
        }
        const operation = block.transaction.operation.Some;
        const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
        const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
        return block.transaction.memo === memo &&
            hash(senderAddress) === hash(operation.Transfer?.from) &&
            hash(receiverAddress) === hash(operation.Transfer?.to) &&
            amount === operation.Transfer?.amount.e8s;
    });
    return tx ? true : false;
};


