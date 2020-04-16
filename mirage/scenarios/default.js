export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  server.createList('definition', 5);
  server.createList('consent', 10);
}
