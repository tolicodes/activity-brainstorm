import { useState, useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

export default (collection: any) => {
  const [entities] = useCollection(collection);
  const [positions, setPositions] = useState({});
  const [entityRows, setEntityRows] = useState([]);

  useEffect(() => {
    if (!entities) return;

    const entityRows = entities.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      doc: collection.doc(doc.id),
    }));

    // we want to sort by the existing position (in case we edit something, and lastUpdated changes) or by the
    // last updated date
    // @ts-ignore
    entityRows.sort(({ lastUpdated: lastUpdatedA = new Date(), id: idA }, { lastUpdated: lastUpdatedB = new Date(), id: idB }) => {
      // @ts-ignore 
      return (positions[idA] - positions[idB]) || (lastUpdatedB.seconds - lastUpdatedA.seconds);
    });

    entityRows.map((data: any, i: number) => {
      // @ts-ignore
      if (positions[data.id]) return data;

      // @ts-ignore
      positions[data.id] = i + 1;

      return data;
    });

    setPositions(positions);
    // @ts-ignore;

    setEntityRows(entityRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entities]);

  return entityRows;
}