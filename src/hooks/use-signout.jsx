import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './use-auth-context';
import { auth, signOut, db, doc, updateDoc } from '../firebase/config';

export const useSignout = () => {
	const [isPending, setIsPending] = useState(false);
	const [isCancelled, setIsCancelled] = useState(false);
	const [error, setError] = useState(null);
	const { dispatch, user } = useAuthContext();

	let navigate = useNavigate();

	const signout = async () => {
		setError(null);
		setIsPending(true);

		try {
			const { uid } = user;

			/** set the "online" field of the user to 'false' */
			await updateDoc(doc(db, 'users', uid), { online: false });

			/** navigate to the dashboard */
			navigate('/');

			/** signout */
			await signOut(auth);

			/** dispatch signout action */
			dispatch({ type: 'SIGNOUT' });

			/** update state */
			if (!isCancelled) {
				setIsPending(false);
				setError(null);
			}
		} catch (err) {
			if (!isCancelled) {
				setError(err.message);
				setIsPending(false);
			}
		}
	};

	useEffect(() => {
		return () => setIsCancelled(true);
	}, []);

	return { signout, isPending, error };
};
