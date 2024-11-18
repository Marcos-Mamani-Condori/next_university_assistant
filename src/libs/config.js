'use client'
let currentOrigin = "";
if (typeof window !== "undefined") {
  currentOrigin = window.origin;
}

export default currentOrigin;
