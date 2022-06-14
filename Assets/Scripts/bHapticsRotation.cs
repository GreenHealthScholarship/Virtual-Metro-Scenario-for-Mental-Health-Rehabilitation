using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class bHapticsRotation : MonoBehaviour{
    public GameObject Camera;
    private void FixedUpdate() {
        transform.eulerAngles = new Vector3(transform.eulerAngles.x, Camera.transform.eulerAngles.y-90, transform.eulerAngles.z );
        transform.position = new Vector3(Camera.transform.position.x, transform.position.y, Camera.transform.position.z);
    }
}
