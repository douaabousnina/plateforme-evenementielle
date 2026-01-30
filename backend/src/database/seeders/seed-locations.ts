import { DataSource } from 'typeorm';
import { Location } from '../../events/entities/location.entity';
import { LocationType } from '../../common/enums/event.enum';

export async function seedLocations(dataSource: DataSource): Promise<Location[]> {
  const repo = dataSource.getRepository(Location);
  const locations = repo.create([
    { type: LocationType.PHYSICAL, venueName: 'Central Park Arena', address: '1 Park Ave', city: 'New York', country: 'USA' },
    { type: LocationType.PHYSICAL, venueName: 'Convention Center', address: '500 Expo Blvd', city: 'Paris', country: 'France' },
    { type: LocationType.PHYSICAL, venueName: 'Blue Note Club', address: '20 Rue de la Paix', city: 'Paris', country: 'France' },
    { type: LocationType.PHYSICAL, venueName: 'Laugh Factory', address: '8001 Sunset Blvd', city: 'Los Angeles', country: 'USA' },
    { type: LocationType.PHYSICAL, venueName: 'Symphony Hall', address: '301 Massachusetts Ave', city: 'Boston', country: 'USA' },
    { type: LocationType.ONLINE, onlineUrl: 'https://stream.example.com/event' },
  ]);
  return repo.save(locations);
}
