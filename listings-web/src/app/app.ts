import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listing } from './listing';

interface ApartmentPhoto {
  url: string;
  label: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 1000px; margin: 2rem auto; padding: 0 1rem; color: #1e293b;">
      <h1 style="color: #4338ca; border-bottom: 2px solid #e0e7ff; padding-bottom: 0.5rem;">🏙️ Объявления (Angular Клиент)</h1>

      @if (error()) {
        <p class="error" style="color: #ef4444; background: #fee2e2; padding: 0.75rem; border-radius: 8px;">{{ error() }}</p>
      }

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.75rem; margin-top: 1.5rem;">
        <!-- Левая колонка: Список объявлений -->
        <div>
          <h3 style="margin-top: 0; color: #334155;">Список объектов (нажмите для просмотра):</h3>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem;">
            @for (item of listings(); track item.id) {
              <li
                (click)="selectListing(item)"
                style="padding: 1rem; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05);"
                [style.border]="selectedListing()?.id === item.id ? '2px solid #6366f1' : '1px solid #cbd5e1'"
                [style.background]="selectedListing()?.id === item.id ? '#f5f3ff' : '#ffffff'">
                <div style="font-weight: 700; font-size: 1.05rem; color: #1e1b4b;">{{ item.title }}</div>
                <div style="color: #64748b; font-size: 0.9rem; margin-top: 4px;">
                  📍 Район: <strong>{{ item.district }}</strong>, {{ item.address }}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                  <span style="color: #059669; font-weight: 800; font-size: 1.1rem;">{{ item.price }} у.е.</span>
                  <span style="background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">
                    🚪 {{ item.rooms }} комн.
                  </span>
                </div>
              </li>
            } @empty {
              <li style="color: #94a3b8; font-style: italic;">Пока нет объявлений</li>
            }
          </ul>
        </div>

        <!-- Правая колонка: Подробная информация и фотографии квартиры -->
        <div>
          @if (selectedListing(); as selected) {
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 14px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: sticky; top: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <h2 style="margin: 0; font-size: 1.3rem; color: #0f172a;">{{ selected.title }}</h2>
                <span style="background: #ecfdf5; color: #047857; font-weight: 800; padding: 4px 10px; border-radius: 8px; font-size: 1.1rem;">
                  {{ selected.price }} у.е.
                </span>
              </div>

              <!-- Главная фотография -->
              <div style="position: relative; width: 100%; height: 260px; border-radius: 10px; overflow: hidden; background: #0f172a; margin-bottom: 0.75rem;">
                <img [src]="activePhoto()" alt="Фото квартиры" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.2s;" />
                <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); color: white; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem;">
                  📷 {{ activePhotoLabel() }}
                </div>
              </div>

              <!-- Миниатюры галереи -->
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 1.25rem;">
                @for (photo of currentPhotos(); track photo.url) {
                  <div
                    (click)="setActivePhoto(photo)"
                    style="height: 60px; border-radius: 6px; overflow: hidden; cursor: pointer; border: 2px solid transparent; opacity: 0.7; transition: all 0.2s;"
                    [style.borderColor]="activePhoto() === photo.url ? '#6366f1' : 'transparent'"
                    [style.opacity]="activePhoto() === photo.url ? '1' : '0.7'">
                    <img [src]="photo.url" [alt]="photo.label" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                }
              </div>

              <!-- Подробные характеристики -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.9rem; line-height: 1.6;">
                <div>📍 <strong>Район:</strong> {{ selected.district }}</div>
                <div>🏢 <strong>Адрес:</strong> {{ selected.address }}</div>
                <div>🚪 <strong>Комнат:</strong> {{ selected.rooms }}</div>
                <div>🕒 <strong>Дата публикации:</strong> {{ selected.createdAt }}</div>
              </div>

              <div style="margin-top: 1rem; font-size: 0.88rem; color: #64748b; line-height: 1.5;">
                ℹ️ <em>Уютная квартира с ремонтом и удобной планировкой в шаговой доступности от ключевых объектов инфраструктуры.</em>
              </div>
            </div>
          } @else {
            <div style="border: 2px dashed #cbd5e1; border-radius: 14px; padding: 4rem 1.5rem; text-align: center; color: #94a3b8;">
              👈 Выберите объявление слева, чтобы увидеть подробную информацию и фото квартиры
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class App {
  private http = inject(HttpClient);
  listings = signal<Listing[]>([]);
  error = signal<string | null>(null);

  selectedListing = signal<Listing | null>(null);
  currentPhotos = signal<ApartmentPhoto[]>([]);
  activePhoto = signal<string>('');
  activePhotoLabel = signal<string>('');

  constructor() {
    this.http.get<Listing[]>('http://localhost:5000/api/listings').subscribe({
      next: (data) => {
        this.listings.set(data);
        if (data.length > 0) {
          this.selectListing(data[0]);
        }
      },
      error: (err) => this.error.set('Сервер недоступен: ' + err.message),
    });
  }

  selectListing(item: Listing) {
    this.selectedListing.set(item);
    const photos = this.resolvePhotos(item);
    this.currentPhotos.set(photos);
    if (photos.length > 0) {
      this.activePhoto.set(photos[0].url);
      this.activePhotoLabel.set(photos[0].label);
    }
  }

  setActivePhoto(photo: ApartmentPhoto) {
    this.activePhoto.set(photo.url);
    this.activePhotoLabel.set(photo.label);
  }

  private resolvePhotos(item: Listing): ApartmentPhoto[] {
    if (item.rooms === 1) {
      return [
        { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&auto=format&fit=crop&q=80', label: 'Гостиная' },
        { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&auto=format&fit=crop&q=80', label: 'Спальня' },
        { url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=900&auto=format&fit=crop&q=80', label: 'Кухня' },
        { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&auto=format&fit=crop&q=80', label: 'Санузел' }
      ];
    } else if (item.rooms === 2) {
      return [
        { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&auto=format&fit=crop&q=80', label: 'Гостиная' },
        { url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?w=900&auto=format&fit=crop&q=80', label: 'Спальня' },
        { url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900&auto=format&fit=crop&q=80', label: 'Кухня' },
        { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=80', label: 'Балкон' }
      ];
    } else if (item.rooms === 3) {
      return [
        { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&auto=format&fit=crop&q=80', label: 'Гостиная' },
        { url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&auto=format&fit=crop&q=80', label: 'Спальня' },
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80', label: 'Кухня' },
        { url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=900&auto=format&fit=crop&q=80', label: 'Ванная' }
      ];
    } else {
      return [
        { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80', label: 'Зал' },
        { url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=900&auto=format&fit=crop&q=80', label: 'Спальня' },
        { url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=900&auto=format&fit=crop&q=80', label: 'Кухня' },
        { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80', label: 'Терраса' }
      ];
    }
  }
}
