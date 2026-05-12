class SessionHelper {
  SetExpireTime(time: number) {
    const expiryTime = Date.now() + time * 1000; // in seconds
    localStorage.setItem("expire_time", JSON.stringify(expiryTime));

    // trigger custom event to notify hook
    window.dispatchEvent(new Event("storage"));
  }
  GetExpireTime() {
    return JSON.parse(localStorage.getItem("expire_time") || "0") as number;
  }
  RemoveExpireTime() {
    localStorage.removeItem("expire_time");
  }
}

export const { SetExpireTime, GetExpireTime, RemoveExpireTime } =
  new SessionHelper();
