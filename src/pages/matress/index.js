import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Matress = () => {
  const [mattresses, setMattresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/mattresses')
      .then(response => {
        setMattresses(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.container}>
      {mattresses.map((mattress) => (
        <div key={mattress.id} style={styles.card}>
          <img src={mattress.image} alt={mattress.name} style={styles.image} />
          <div style={styles.details}>
            <h2 style={styles.title}>{mattress.name}</h2>
            <p style={styles.description}>{mattress.description}</p>
            <p style={styles.price}>Price: ${mattress.price}</p>
            <p style={styles.discount}>Discount: {mattress.discount}%</p>
            <p style={styles.info}>Category: {mattress.category}</p>
            <p style={styles.info}>Size: {mattress.size}</p>
            <p style={styles.info}>Firmness: {mattress.firmness}</p>
            <p style={styles.info}>Type: {mattress.Type}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '10px',
    padding: '20px',
    flex: '1 1 calc(33.333% - 40px)',
    boxSizing: 'border-box',
    transition: 'transform 0.2s',
    maxWidth: '300px',
    minWidth: '250px',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  details: {
    marginTop: '15px',
  },
  title: {
    fontSize: '1.5em',
    marginBottom: '10px',
  },
  description: {
    margin: '5px 0',
  },
  price: {
    fontWeight: 'bold',
  },
  discount: {
    color: '#FF5733',
  },
  info: {
    margin: '5px 0',
  },
};

export default Matress;
