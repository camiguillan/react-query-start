import { Link, Outlet, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Header from '../Header.jsx';
import { deleteEvent, fetchEvent } from '../../util/https.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '../../util/https.js';

const path = 'https://cautious-halibut-r69xr5795762w759-3000.app.github.dev/'


export default function EventDetails() {
  const navigate = useNavigate();
  const params = useParams()
  const {mutate, deleteIsError, deleteError} = useMutation({
    mutationFn: deleteEvent, 
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none'
      })
      navigate('/events')
    }
  })

  const {data, isPending, isError, error}  = useQuery({
    queryKey:['events', params.id] , 
    queryFn: ({signal}) => fetchEvent( {signal,id: params.id} )

  })


  function handleDelete(){
    mutate({id: params.id})
  }

  let content

  if(isPending){
    content = (
      <p>Loading data....</p>
    )
  }

  if(isError){
    content = (<div  id='event-details-content'  className='center' > 
    <ErrorBlock  title='There has been an error whule trying to fetch the event data....'  message={error.info?.message || 'try again later '}   />
 </div>)
  }


  if(data){

    const formattedData = new Date(data.date).toLocaleDateString('en-US',{
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

    content = (
    <>
          <header>
          <h1> {data.title}  </h1>
          <nav>
            <button onClick={handleDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        
        <div  id='event-details-content'  className='center' > 
            <p>Fetching event data</p>
        </div>
    <div id="event-details-content">
    <img src={path+data.image} alt={data.title} />
    <div id="event-details-info">
      <div>
        <p id="event-details-location"> {data.location} </p>
        <time dateTime={`Todo-DateT$Todo-Time`}> {formattedData} @ {data.time}</time>
      </div>
      <p id="event-details-description"> {data.description}  </p>
    </div>
  </div>
    </>
  )
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
        
      </article>
    </>
  );
}
