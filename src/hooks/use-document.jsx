import { useEffect, useState } from 'react';
import { db, doc, onSnapshot } from '../firebase/config';

export const useDocument = (col, id) => {
	const [document, setDocument] = useState(null);
	const [error, setError] = useState(null);

	/** realtime document data */
	useEffect(() => {
		const unsubscribe = onSnapshot(
			doc(db, col, id),
			(snapshot) => {
				/** ensure the document exists and has data */
				if (snapshot.data()) {
					setDocument({ ...snapshot.data(), id: snapshot.id });
					setError(null);
				} else {
					setError('Sorry, no such document exists');
				}
			},
			(err) => {
				console.log(err.message);
				setError('Failure to retrieve document');
			}
		);

		/** unsubscribe on unmount */
		return () => unsubscribe();
	}, [col, id]);

	return { document, error };
};
