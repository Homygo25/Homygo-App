import React from 'react';
import MapComponent from '@/components/MapComponent';

const UserMapPage = () => {
  return (
    <div className="h-screen w-screen fixed inset-0">
      <MapComponent isUserDashboard={true}/>
    </div>
  );
};

export default UserMapPage;