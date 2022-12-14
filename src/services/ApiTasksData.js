import { useState, useEffect } from "react";


const ApiTasksData = () => {

  /* console.log(originalName); */


  const [calData, setCalData] = useState();

  /* const pokeName = originalName.toLowerCase(); */
  const extUrl="tasks";

  useEffect(() => {
    const url = `https://projectberlin-backend.herokuapp.com/${extUrl}`;
        fetch(url)
        .then((res) => res.json())
        .then((data) => {
            setCalData(data);

             console.log(data); 
        })
        .catch((e) => console.log(e.message));
  }, []);
  if (!calData) return null;
  return calData;
};

export default ApiTasksData;