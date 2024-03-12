import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Function สำหรับอัปโหลดรูปภาพ
export async function uploadImageAsync(uri) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const storage = getStorage();
  const storageRef = ref(
    storage,
    "your-directory-name/" + new Date().toISOString()
  );
  await uploadBytes(storageRef, blob);

  // ปิดและเพิ่ม URL ไปยัง Firestore
  blob.close();
  return await getDownloadURL(storageRef);
}
