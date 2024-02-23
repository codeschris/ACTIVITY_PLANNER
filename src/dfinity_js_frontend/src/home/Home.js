import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { NotificationError, NotificationSuccess } from "../components/utils/Notifications";
import { createActivity, getActivitiesByStatus, getActivitiesByTag, getActivityByAscendingOrder, getActivities as getActivityList } from "../utils/planner";
import { Row } from "react-bootstrap";
import Loader from "../components/utils/Loader";
import AddActivity from "../components/planner/AddActivity";
import Activity from "../components/planner/Activity";
import FilterTab from "../components/planner/FilterTab";

const Home = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchStatus, setSearchStatus] = useState("");
    const count = activities.length;
    const getActivities = useCallback(async () => {
        try {
          setLoading(true);
          setActivities(await getActivityList());
        } catch (error) {
          console.log({ error });
        } finally {
          setLoading(false);
        }
    });

    const addActivity = async (data) => {
        try {
          setLoading(true);
          createActivity(data).then((resp) => {
            getActivities();
          });
          toast(<NotificationSuccess text="Activity added successfully." />);
        } catch (error) {
          console.log({ error });
          toast(<NotificationError text="Failed to create an Activity." />);
        } finally {
          setLoading(false);
        }
      };


      const handleSearchStatus = async (status) => {
        setSearchStatus(status);
        try {
          setLoading(true);
          setActivities(await getActivitiesByStatus(status));
        } catch (error) {
          console.log({error});
        } finally {
          setLoading(false);
        }
      }

      const handleSortAsc = async () => {
        try {
          setLoading(true);
          await getActivityByAscendingOrder().then((resp) => {
            setActivities(resp);
          } );

        } catch (error) {
          console.log({error});
        } finally {
          setLoading(false);
        }
      }

      const handleFilterByTag = async (filterTag) => {
        try {
          setLoading(true);
          await getActivitiesByTag(filterTag).then((resp) => {
            setActivities(resp);
          } );

        } catch (error) {
          console.log({error});
        } finally {
          setLoading(false);
        }

      }

    useEffect(() => {
        getActivities();
    },[]);

    return (
        <>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
              <h1 className="fs-4 fw-bold mb-0">Activity Planner</h1>
              <AddActivity save={addActivity} />
            </div>
            <hr />
            <div className="d-flex justify-content-between align-items-center mb-1 mt-1">
                <h4 className="fs-4 fw-bold mb-0">Filter By: </h4>
                <FilterTab  handleSearchStatus={handleSearchStatus} handleSortAsc={handleSortAsc} filterByTag={handleFilterByTag} />
            </div>
            <hr/>
            <strong className="fs-4 fw-bold mb-0">No of Activities: {count}</strong>

            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
              {activities.map((_activity, index) => (
                <Activity
                    key={index}
                    activity={{
                        ..._activity,
                    }}
                />
              ))}
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </>
    )
}

export default Home