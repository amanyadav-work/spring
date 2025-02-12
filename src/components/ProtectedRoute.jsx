import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const ProtectedRoute = ({ component }) => {

    const { isLoaded, user, isSignedIn } = useUser();
    const {pathname} = useLocation()


    if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
        return <Navigate to="/?sign-in=true" />
    }
    if (!isLoaded) {
        return (<BarLoader className='z-10' width="100%" color='yellow'/>)
    }

    if(!user?.unsafeMetadata?.role && pathname!=='/onboarding' && user !==undefined){
        return <Navigate to="/onboarding" />
    }
   
    return component
}

export default ProtectedRoute
