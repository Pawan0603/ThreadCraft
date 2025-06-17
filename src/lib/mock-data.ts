import type { Order } from "./types"

export function getMockOrders(): Order[] {
  return [
    {
      id: "ORD-123456",
      customer: {
        name: "John Doe",
        phone: "(123) 456-7890",
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        },
      },
      items: [
        {
          productId: "1",
          name: "Classic White Tee",
          price: 24.99,
          quantity: 2,
          size: "L",
        },
        {
          productId: "3",
          name: "Urban Graphic Tee",
          price: 34.99,
          quantity: 1,
          size: "M",
        },
      ],
      total: 84.97,
      status: "Pending",
      createdAt: "2023-06-12T10:30:00Z",
    },
    {
      id: "ORD-789012",
      customer: {
        name: "Jane Smith",
        phone: "(234) 567-8901",
        address: {
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90001",
        },
      },
      items: [
        {
          productId: "2",
          name: "Vintage Black Tee",
          price: 29.99,
          quantity: 1,
          size: "S",
        },
      ],
      total: 29.99,
      status: "Dispatched",
      createdAt: "2023-06-11T14:45:00Z",
    },
    {
      id: "ORD-345678",
      customer: {
        name: "Robert Johnson",
        phone: "(345) 678-9012",
        address: {
          street: "789 Pine St",
          city: "Chicago",
          state: "IL",
          zipCode: "60007",
        },
      },
      items: [
        {
          productId: "5",
          name: "Minimalist Logo Tee",
          price: 32.99,
          quantity: 3,
          size: "XL",
        },
        {
          productId: "7",
          name: "Pocket Detail Tee",
          price: 26.99,
          quantity: 2,
          size: "L",
        },
      ],
      total: 152.95,
      status: "Delivered",
      createdAt: "2023-06-10T09:15:00Z",
    },
    {
      id: "ORD-901234",
      customer: {
        name: "Emily Davis",
        phone: "(456) 789-0123",
        address: {
          street: "321 Maple Rd",
          city: "Houston",
          state: "TX",
          zipCode: "77001",
        },
      },
      items: [
        {
          productId: "8",
          name: "Limited Edition Artist Tee",
          price: 49.99,
          quantity: 1,
          size: "M",
        },
      ],
      total: 49.99,
      status: "Pending",
      createdAt: "2023-06-09T16:20:00Z",
    },
  ]
}
