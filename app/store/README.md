# Redux Store Architecture

## Структура

```
app/store/
├── api/                    # API endpoints (RTK Query)
│   ├── baseApi.ts         # Базовая конфигурация API
│   └── sectionsApi.ts     # API для работы с секциями
├── slices/                # Redux slices (для локального состояния)
├── hooks.ts               # Типизированные хуки
├── store.ts               # Конфигурация store
├── StoreProvider.tsx      # Provider для Next.js
└── index.ts               # Экспорты
```

## Использование

### 1. Типизированные хуки

```tsx
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'

function MyComponent() {
  const dispatch = useAppDispatch()
  const someState = useAppSelector((state) => state.someSlice)
}
```

### 2. RTK Query (для API запросов)

```tsx
import { useGetSectionsQuery } from '@/app/store/api/sectionsApi'

function SectionsList() {
  const { data, isLoading, error } = useGetSectionsQuery()
  
  if (isLoading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка!</div>
  
  return <div>{data?.map(...)}</div>
}
```

## Где делать API запросы?

### ✅ Правильно: RTK Query (app/store/api/)

**Преимущества:**
- Автоматическое кэширование
- Автоматическая повторная загрузка
- Оптимистичные обновления
- Типизация из коробки
- Состояние загрузки/ошибки автоматически

**Пример:**

\`\`\`typescript
// app/store/api/productsApi.ts
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], string>({
      query: (sectionId) => \`/products?section=\${sectionId}\`,
      providesTags: ['Products'],
    }),
    
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
  }),
})
\`\`\`

### ❌ Неправильно: fetch/axios в компонентах

```tsx
// ❌ Не делайте так!
function MyComponent() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])
}
```

## Добавление нового API endpoint

1. Создайте файл в `app/store/api/` (например, `productsApi.ts`)
2. Импортируйте `baseApi`
3. Используйте `injectEndpoints`
4. Экспортируйте хуки

```typescript
import { baseApi } from './baseApi'

export interface Product {
  id: number
  name: string
  price: number
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Products'],
    }),
  }),
})

export const { useGetProductsQuery } = productsApi
```

## Локальное состояние (Redux Slices)

Для состояния, которое не связано с API (например, UI состояние):

```typescript
// app/store/slices/uiSlice.ts
import { createSlice } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
}

const initialState: UIState = {
  sidebarOpen: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
  },
})

export const { toggleSidebar } = uiSlice.actions
export default uiSlice.reducer
```

Затем добавьте в store:

```typescript
// app/store/store.ts
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    ui: uiReducer, // добавьте сюда
  },
  // ...
})
```


