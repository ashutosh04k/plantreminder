import React, { useState, useEffect } from "react";
import { plants, styles } from "../utils/constant";

const PlantReminder = () => {
  const [selectedPlant, setSelectedPlant] = useState("");
  const [careInfo, setCareInfo] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  let reminderInterval = null;

  useEffect(() => {
    if ("Notification" in window) {
      console.log("Notification permission:", Notification.permission);
      Notification.requestPermission().then((permission) => {
        console.log("Updated permission:", permission);
      });
    }
  }, []);

  const handlePlantChange = (event) => {
    const plant = event.target.value;
    setSelectedPlant(plant);
    setCareInfo(plants[plant]);
  };

  const sendNotification = (title, message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body: message });
      console.log("Notification sent:", title);
      alert("Notification enabled");
    } else {
      alert(`${title}\n${message}`);
      console.log("Alert shown instead of notification:", title);
    }
  };

  const scheduleNotifications = () => {
    if (!careInfo) return;
    if (Notification.permission !== "granted") {
      alert("Notifications are not enabled. Showing reminders as alerts instead.");
    }

    setNotificationsEnabled(true);
    sendNotification(" Notifications Enabled", `Reminders for ${selectedPlant} have started!`);
    
    reminderInterval = setInterval(() => {
      sendNotification(`🌿 Care Reminder`, `Time to water your ${selectedPlant}! 💧`);
    }, 10000); // Sends every 10 seconds (for testing)
  };

  const stopNotifications = () => {
    setNotificationsEnabled(false);
    clearInterval(reminderInterval);
    sendNotification("Notifications Disabled", `Reminders for ${selectedPlant} have been stopped.`);
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>🌱 Plant Care Reminder</h2>
      <label style={styles.label}>Select a plant:</label>
      <select onChange={handlePlantChange} value={selectedPlant} style={styles.select}>
        <option value="">-- Choose a plant --</option>
        {Object.keys(plants).map((plant) => (
          <option key={plant} value={plant}>
            {plant}
          </option>
        ))}
      </select>

      {careInfo && (
        <div style={styles.info}>
          <p><strong>💧 Watering:</strong> {careInfo.water}</p>
          <p><strong>☀️ Sunlight:</strong> {careInfo.sunlight}</p>
          {!notificationsEnabled ? (
            <button onClick={scheduleNotifications} style={styles.button}>
              Enable Reminders
            </button>
          ) : (
            <button onClick={stopNotifications} style={styles.buttonDisabled}>
              Stop Reminders
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantReminder;
