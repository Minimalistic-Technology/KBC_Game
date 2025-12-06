import axiosInstance from "@/utils/axiosInstance";

export async function fetchMe() {
  try {
    const res = await axiosInstance.get("/api/verify/me", {
      withCredentials: true, 
    });
    return { ok: true, data: res.data };
  } catch (err: any) {
    return { ok: false, data: null };
  }
}
