
#ifndef _LOCK_H_
#define _LOCK_H_

#include "mqtt_client.h"

#define GPIO_ON 0  // Turn it on
#define GPIO_OFF 1 // Turn it off
#define GPIO_OUTPUT_PIN_SEL (1ULL << CONFIG_UNLOCK_PIN_GPIO)

// MQTT topics are:
//    /device/[ESP MAC Address]/unlock => [Time in seconds] - How long a device should unlock for, default is locked.
//    /device/[ESP MAC Address]/register => [TYPE]    - Register a type of device using the mac address, e.g. a "HACKLAND_LOCK"
#define BASE_TOPIC "/device"

void v_unlock_task(void *);
void kill_unlock_task();
void device_unlock_for_time(int);
void lock_handle_incoming_data(esp_mqtt_event_handle_t);
char *lock_get_topic_register();
char *lock_get_topic_unlock();
const char *lock_get_device_type();
void lock_init();

#endif // _LOCK_H_