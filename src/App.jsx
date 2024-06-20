import { useCallback, useEffect, useRef, useState } from 'react'

import './App.css'

function App() {
  const loaderRef=useRef()
  const [count, setCount] = useState(0)
  const [images, setImages] = useState([])
  const fetchimages = async (index) => {
    try {
      const url = `https://dummyjson.com/products?_page=${index}&_limit=9`
      const res = await fetch(url);
      const data = await res.json()
      console.log(data.products)

      return data.products
    } catch (error) {
      console.log("error", error)
    }
  }
  const fetchfirstpage = async () => {
    const data = await fetchimages(1)
    setImages(data)
  }
  useEffect(() => {
    fetchfirstpage()
  }, [])
  const [page,setPage]=useState(2)
  const [loading, setLoading] = useState(false)
  const getdata=useCallback(async()=>{
    if(loading)
      return
    setLoading(true)
    const data=await fetchimages(page)
    console.log('page',page)
    setImages((prevImages)=>[...prevImages,...data])
    setTimeout(() => {
      setLoading(false)
    }, 2000);
    setPage((prevpage)=>prevpage+1)

  },[page,loading])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        // Call next page data
        getdata();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    // Cleanup function to unobserve the loaderRef
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [getdata]);
  
  
  console.log(images)

  return (
    <>
      <h1>infinite scroll</h1>
      {
        images?.map((e, index) => {
          return (
            <>
              <img src={e.thumbnail} alt={e.title} key={index} className='img'/>
            </>
          )
        })
      }
      <div ref={loaderRef}>
{loading && <div><h2>loading</h2></div>}
      </div>
    </>
  )
}

export default App
