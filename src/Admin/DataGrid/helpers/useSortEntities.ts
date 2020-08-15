import { useState, useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

export default (collection: any, entityDefinition: any) => {
  const [entities] = useCollection(collection);
  const [positions, setPositions] = useState({});
  const [entityRows, setEntityRows] = useState([]);

  useEffect(() => {
    if (!entities || !collection || !entityDefinition) {
      setEntityRows([]);
      return;
    }

    const clearOldProps = (obj: any) => {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          delete obj[prop];
        }
      }
      return obj
    }

    const newEntityRows = entities.docs.map(doc => {
      const existing = entityRows.find((row: any) => (
        row.doc.id == doc.id
      ));

      const data = {
        ...doc.data(),
        id: doc.id,
        // data() works
        doc,
        // update() works
        firebaseDoc: collection.doc(doc.id),
      };

      // we want to assign to the same object while clearing old
      // values so that Grid doesn't think it's a new row
      // https://github.com/adazzle/react-data-grid/blob/canary/src/DataGrid.tsx#L772
      const assignToObj = (existing && clearOldProps(existing)) ||
        {};

      Object.assign(assignToObj, data);

      return assignToObj;
    });

    // we want to sort by the existing position (in case we edit something, and lastUpdated changes) or by the
    // last updated date
    // @ts-ignore
    newEntityRows.sort(({ lastUpdated: lastUpdatedA = new Date(), id: idA }, { lastUpdated: lastUpdatedB = new Date(), id: idB }) => {
      // @ts-ignore 
      return (positions[idA] - positions[idB]) || (lastUpdatedB.seconds - lastUpdatedA.seconds);
    });

    newEntityRows.map((data: any, i: number) => {
      // @ts-ignore
      if (positions[data.id]) return data;

      // @ts-ignore
      positions[data.id] = i + 1;

      return data;
    });

    setPositions(positions);

    // @ts-ignore;
    setEntityRows(newEntityRows);
  }, [entities, entityDefinition, collection]);

  return entityRows;
}