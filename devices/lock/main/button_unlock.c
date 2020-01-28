
/**
 * This code is for the button unlock.
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

#include "driver/gpio.h"

#include "esp_log.h"
#include "esp_system.h"

#include "lock.h"

static const char *TAG = "button_unlock";

#define GPIO_INPUT_IO_1 CONFIG_UNLOCK_BUTTON_GPIO
#define GPIO_INPUT_PIN_SEL ((1ULL << GPIO_INPUT_IO_1))

static xQueueHandle gpio_evt_queue = NULL;

static void gpio_isr_handler(void *arg)
{
    uint32_t gpio_num = (uint32_t)arg;
    xQueueSendFromISR(gpio_evt_queue, &gpio_num, NULL);
}

static void gpio_task_example(void *arg)
{
    uint32_t io_num;
    long int last_click_time = xTaskGetTickCount() * portTICK_RATE_MS;
    for (;;)
    {

        // This will block until we timeout, or until a button is pressed
        xQueueReceive(gpio_evt_queue, &io_num, 2000 / portTICK_RATE_MS);

        // See if a button is being pressed
        long int click_time = xTaskGetTickCount() * portTICK_RATE_MS;
        bool is_pressed = gpio_get_level(io_num) == 0;
        bool has_bounced = click_time - last_click_time < 100;

        if (!is_pressed || has_bounced)
        {
            // Button has bounced, or has been released.
        }
        else
        {
            // Button is currently being pressed.
            device_unlock_for_time(3);
        }

        last_click_time = click_time;
    }
}

void btn_unlock_init()
{
    ESP_LOGE(TAG, "HERE\n");

    gpio_config_t io_conf;
    io_conf.intr_type = GPIO_INTR_NEGEDGE;
    io_conf.mode = GPIO_MODE_INPUT;
    io_conf.pin_bit_mask = GPIO_INPUT_PIN_SEL;
    io_conf.pull_up_en = 1;
    io_conf.pull_down_en = 0;
    gpio_config(&io_conf);

    //create a queue to handle gpio event from isr
    gpio_evt_queue = xQueueCreate(10, sizeof(uint32_t));
    //start gpio task
    xTaskCreate(gpio_task_example, "gpio_task_example", 2048, NULL, 10, NULL);

    //install gpio isr service
    gpio_install_isr_service(0);
    gpio_isr_handler_add(GPIO_INPUT_IO_1, gpio_isr_handler, (void *)GPIO_INPUT_IO_1);
}
