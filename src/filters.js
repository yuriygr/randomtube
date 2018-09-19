const SIZES = ["KB", "MB"];
const MB = 1000;
const DP = 2;

const formatFileSize = (KB) => {
  if (KB === 0) return "0 Bytes";
  const i = Math.floor(Math.log(KB) / Math.log(MB));
  return `${parseFloat((KB / Math.pow(MB, i)).toFixed(DP))} ${SIZES[i]}`;
};

export default {formatFileSize}
