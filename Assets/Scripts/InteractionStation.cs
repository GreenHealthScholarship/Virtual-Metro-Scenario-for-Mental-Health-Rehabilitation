using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR;

public class InteractionStation : MonoBehaviour
{

    public GameObject subway;
    Animator subwayAnimator;

    private float enterTime = 15f;
    private float travelTime = 197f;

    private InputDevice targetDevice;

    private void Awake()
    {
        subwayAnimator = subway.GetComponent<Animator>();
    }

    private void Start()
    {
        List<InputDevice> devices = new List<InputDevice>();
        InputDeviceCharacteristics leftControllerCharacteristics = InputDeviceCharacteristics.Left | InputDeviceCharacteristics.Controller;
        InputDevices.GetDevicesWithCharacteristics(leftControllerCharacteristics, devices);

        if (devices.Count > 0)
        {
            targetDevice = devices[0];
        }
    }

    void Update()
    {

        // Exit hallway to leave the simulation
        if (gameObject.transform.position.x < -13f )
        {
            //UnityEditor.EditorApplication.isPlaying = false;
            Application.Quit();
        }

        // Enter train to assign it as a parent of the XR Rig
        if (gameObject.transform.parent != subway.transform && gameObject.transform.position.x > -2.5f)
        {
            gameObject.transform.parent = subway.transform;
        }

        // Countdown while inside the train
        if (enterTime > 0 && gameObject.transform.parent == subway.transform)
        {
            enterTime -= Time.deltaTime;
        }

        // Start moving the train if the pacient is still inside
        if (enterTime <= 0 && gameObject.transform.parent == subway.transform)
        {
            subwayAnimator.SetBool("train_moving", true);
        }

        // Countdown travel time
        if (subwayAnimator.GetBool("train_moving") && travelTime > 0)
        {
            travelTime -= Time.deltaTime;
        }

        // Get input from controllers and wait if either time runs out or a button is pressed for the subway to stop
        targetDevice.TryGetFeatureValue(CommonUsages.primaryButton, out bool primaryButtonValue);
        if (travelTime <= 0 || (subwayAnimator.GetBool("train_moving") && primaryButtonValue))
        {
            subwayAnimator.SetBool("train_moving", false);
            enterTime = 50f;
            travelTime = 197f;
        }

        // De-parent the subway when the pacient gets outside of the train
        if (gameObject.transform.parent == subway.transform && gameObject.transform.position.x < -2.5f)
        {
            gameObject.transform.parent = null;
            enterTime = 15f;
            travelTime = 197f;
        }

    }



}
