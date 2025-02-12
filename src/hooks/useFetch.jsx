import { useSession } from "@clerk/clerk-react";
import { useState } from "react";


const useFetch = (cb, option = {}, ...args) => {

    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const { session } = useSession();

  

    const fn = async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const supabaseAccessToken = await session.getToken({
                template: "supabase",
            });
            const response = await cb(supabaseAccessToken, option, ...args)
            setData(response);
            setError(null)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    return {data, loading, error, fn}
}

export default useFetch
