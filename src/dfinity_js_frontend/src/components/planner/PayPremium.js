import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { payPremiumPlan } from '../../utils/planner';
import { toast } from 'react-toastify';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';

const PayPremium = ({id,getActivities}) => {
    const [loading, setLoading] = useState(false);
    const estPremiumPlanPrice = 10;

    const pay = async () => {
        try {
          setLoading(true);
          const premiumPlanPrice = parseInt(estPremiumPlanPrice, 10) * 10 ** 8;
          await payPremiumPlan({
            id
          },premiumPlanPrice).then((resp) => {
            getActivities();
            // Reload Page the purchase will work 
            toast(<NotificationSuccess text="Premium Subscribed successfully" />);
          });
        } catch (error) {
          toast(<NotificationError text="Failed to Subscribe product." />);
        } finally {
          setLoading(false);
        }
      };




  return (
    <Button variant="outline-dark" className="w-100 py-3 mb-2"
    onClick={pay}
    >
        Pay Premium
    </Button>
  )
}

export default PayPremium