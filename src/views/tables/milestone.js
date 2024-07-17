

// import React from 'react';

// const MilestoneIcon = ({ count }) => {
//   return (
//     <svg width="50" height="70" viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg">
//       {/* Red top part */}
//       <path d="M 25 0 A 25 25 0 0 1 50 25 L 0 25 A 25 25 0 0 1 25 0" fill="red" />
//       {/* White bottom part */}
//       <rect x="0" y="25" width="50" height="25" fill="white" />
//       {/* Text inside the icon */}
//       <text x="25" y="20" textAnchor="middle" fill="#FFF" fontSize="16" fontWeight="bold">{count}</text>
//       {/* <text x="25" y="40" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">milestone</text> */}
      
//     </svg>
//   );
// };

// export default MilestoneIcon;


// import React from 'react';

// const MilestoneIcon = ({ count }) => {
//   return (
//     <svg width="40" height="70" viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg">
//       <path d="M 25 0 A 25 25 0 0 1 50 25 L 0 25 A 25 25 0 0 1 25 0" fill="red" />
//       <rect x="0" y="25" width="50" height="35" fill="black" />
//       <text x="25" y="20" textAnchor="middle" fill="#FFF" fontSize="16" fontWeight="bold">{count}</text>
      
//     </svg>
//   );
// }; 
// export default MilestoneIcon;


// import React from 'react';

import React from 'react';

const MilestoneIcon = ({ count }) => {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <path d="M 25 0 A 25 25 0 0 1 50 25 L 0 25 A 25 25 0 0 1 25 0" fill="red" />
      <rect x="0" y="25" width="50" height="25" fill="grey" />
      <text x="25" y="20" textAnchor="middle" fill="#000" fontSize="16" fontWeight="bold">{count}</text>
    </svg>
  );
};

export default MilestoneIcon;

