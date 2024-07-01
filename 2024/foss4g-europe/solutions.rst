.. _js_service_chaining_solutions:

Issue playing with building blocks?
=============================================

In case you face any issues please use the following command to have
he demo UI working with your services.

.. code-block:: guess
    
    docker compose exec zookernel bash
    # From the container run the following commands:
    curl -o /usr/lib/cgi-bin/foss4gws.js https://raw.githubusercontent.com/ZOO-Project/workshops/master/2024/foss4g-europe/files/foss4gws.js
    curl -o /usr/lib/cgi-bin/Mask.zcfg https://raw.githubusercontent.com/ZOO-Project/workshops/master/2024/foss4g-europe/files/Mask.zcfg
    curl -o /usr/lib/cgi-bin/BufferMask.zcfg https://raw.githubusercontent.com/ZOO-Project/workshops/master/2024/foss4g-europe/files/BufferMask.zcfg
    curl -o /usr/lib/cgi-bin/BufferRequest.zcfg https://raw.githubusercontent.com/ZOO-Project/workshops/master/2024/foss4g-europe/files/BufferRequest.zcfg

Load the `url <http://localhost/zoows-2024/#>`__ again, it should work
properly now.
