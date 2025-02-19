import { Link, useNavigate } from 'react-router-dom';
import { Mutation, QueryClient } from '@tanstack/react-query';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchEvent, queryClient, updateEvent } from '../../util/https.js';
import { useParams } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx'

export default function EditEvent() {
  const navigate = useNavigate();
  const params = useParams()

  const {data, isPending, isError, error} = useQuery({
    queryKey: ['events', params.id],
    queryFn: ({signal}) =>  fetchEvent({signal, id: params.id })
  })

  const {mutate, isError: isErrorMutation,  error: errorMutation } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      await queryClient.cancelQueries({queryKey: ['events' , params.id]})
     const prevEventData =  queryClient.getQueriesData(['events' , params.id]); //in case the update fails, we would want to set the previous dat aup
      queryClient.setQueryData(['events' , params.id], data.event )
      return {prevEventData}
    }
    ,
    onError: (error, data, context) => {
      queryClient.setQueriesData(['events' , params.id], context.prevEventData)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['events' , params.id])
    } //when the mutation has been completed ( error or success)
  })

  function handleSubmit(formData) {
    mutate({id: params.id, event: formData})
    navigate('../')
  }

  function handleClose() {
    navigate('../');
  }

  let content 

  if(isError){
    content = <>
    <ErrorBlock  title='There was an error while trying to fetch the selected event data'
      message={error.info?.message || "Could not fetch event data, please try again later"}
      />
      <div  className=''form-actions > 
        <Link  to='../'  className='button'  >   Okay   </Link>  </div>
      </>  
  }

  if(isPending){
    content = < div   className='center' > 
     <LoadingIndicator /> 
     </div>
  }

  if(data){
    content = <>   
      <EventForm inputData={data} onSubmit={handleSubmit}>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </EventForm>
    </>
  }

  return (
    <Modal onClose={handleClose}>
    
      {content}      

    </Modal>
  );
}
