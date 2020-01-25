# Hackland Access Server

This server, written in TypeScript, controls access to Hackland's doors.

## Get it running

1. Prerequisits are: MongoDB and an MQTT broker (like Mosquitto).
1. Clone the repository.
1. Update the `configuration.json` for your needs.
1. Run the following commands.

```sh
cd server
npm install  # This will install the necessary components.
npm start    # This will run the server.
```

Install the systemd service

```sh
# The service file
sudo cp hacklandaccess.service /etc/systemd/system/hacklandaccess.service

# Enable the systemd service
sudo systemctl enable hacklandaccess.service

# Start the service
sudo systemctl start hacklandaccess.service

# Check the service status
systemctl status hacklandaccess.service

# Check the service logs since the machine booted
journalctl -u hacklandaccess.service -b

```

## Development

The code contains the following models:

`Device` - This can be any device that can create `DeviceEvent`s or execute `Action`s. For example a lock.
`DeviceEvent` - This is an event that occurs on a device, for example a `card` event (someone swipes an rfid card on a card reader). An event can also come from an external source, such as from the website, etc.
`Action` - This is what gets execute when an event is triggered. One event can trigger multiple actions.
`User` - This is list of users, it contains their details (name, etc), their rfid token (one person can have multiple rfid tokens/cards) and their [hackland.slack.com](https://hackland.slack.com) user id. If they happen to be in the supporters channel and they
have registered their card, then they will be granted access.

The transport protocol is MQTT, the following structure of the topics is used. This server will listen to the MQTT topics for events
which are created by the devices. The server will then process the event and execute actions, if necessary.

MQTT topic structure:

```text
/device/[DEVICE UID]/[EVENT/ACTION]   [MESSAGE]

Where:
    - [DEVICE UID] is a unique ID of the device.  Typically the Wifi Mac ID.
    - [EVENT] is fired by a device, the server will handle the action.
    - [ACTION] is fired by the server and it will target a specific device.
    - [MESSAGE] is the payload that gives more details around the server.

Examples of topics and messages:

"/device/600194202C80/card" "B7B0D5A4":
    - This comes from a device with Mac Id "600194202C80", it says a "card" has been swipped and the rfid token is "B7B0D5A4".

"/device/84f3eb770609/unlock" "3"
    - This comes from the server and targets the device with Mac Id "84f3eb770609", it gives the "unlock" action for "3" seconds.

"/device/600194202C80/register" "rfid-reader":
    - This is device 600194202C80 registering as an rfid-reader.
```
