import React, { useState, useEffect } from 'react'
import Map from './Map'
import { getRandomPosition } from './utils'

const App = () => {
  const [customerPosition, setCustomerPosition] = useState(null);
  const [deliveryPosition, setDeliveryPosition] = useState(null);

  useEffect(() => {
    const customerPos = getRandomPosition()
    const deliveryPos = getRandomPosition()
    
    setCustomerPosition(customerPos)
    setDeliveryPosition(deliveryPos)

    const interval = setInterval(() => {
      setCustomerPosition(getRandomPosition())
      setDeliveryPosition(getRandomPosition())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return <Map customerPosition={customerPosition} deliveryPosition={deliveryPosition} />
}

export default App
