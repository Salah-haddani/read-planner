export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("This browser does not support notifications.");
    return false;
  }

  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return true;
}

export function scheduleReadingNotifications(goal) {
  if (!("Notification" in window)) return;

  Notification.requestPermission().then((permission) => {
    if (permission !== "granted") return;

    if (window.readingReminderInterval) {
      clearInterval(window.readingReminderInterval);
    }

    window.readingReminderInterval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const day = now.getDay();

      const readingDays =
        goal.routineType === "daily"
          ? [0, 1, 2, 3, 4, 5, 6] // Every day
          : [1, 3, 5].slice(0, goal.daysPerWeek); // e.g. Mon/Wed/Fri for 3 days

      // Trigger notification exactly at 8:00 PM on reading days
      if (hour === 20 && minutes === 0 && readingDays.includes(day)) {
        const notification = new Notification("📚 Reading Reminder", {
          body: `Time to read your ${goal.pagesPerDay} pages today!`,
          icon: "/book-icon.png",
        });

        notification.onclick = () =>
          window.open("http://localhost:3000", "_blank");
      }
    }, 60000);
  });
}
