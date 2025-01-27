
const path = 'https://cautious-halibut-r69xr5795762w759-3000.app.github.dev/'

export async function fetchEvents({signal, searchTerm}) {
    let url = path + 'events';

    if(searchTerm){
      url += '?search=' + searchTerm
    }

    const response = await fetch(path, {signal: signal});

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the events');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const { events } = await response.json();

    return events;
}