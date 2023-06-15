# Introduction

EventManagement was built from the ground-up with a JSON API that makes it easy to managaging events.

## Use Cases

To simplifying the data of all events at the one place, it makes the job easy

## Authorization

When user will create their first signup after the fresh installation, owner role will be assigned

```http
GET /api/events/?id=145
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | **Required**. Your event id |

## Responses

Many API endpoints return the JSON representation of the resources created or edited. However, if an invalid request is submitted, or some other error occurs, API will returns a JSON response in the following format:

```javascript
{
  "message" : string,
  "success" : bool,
  "data"    : string
}
```

The `message` attribute contains a message commonly used to indicate errors or, in the case of deleting a resource, success that the resource was properly deleted.

The `success` attribute describes if the transaction was successful or not.

The `data` attribute contains any other metadata associated with the response. This will be an escaped string containing JSON data.

## Status Codes

API will returns the following status codes:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |
