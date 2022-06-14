using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Bhaptics.Tact.Unity
{
    public class bHapticsManager : MonoBehaviour{
        [SerializeField] private HapticClip clip;
        private bool activated = false;
        private char side;

        private void Start() {
            if(gameObject.transform.parent.transform.parent.name == "Back") side = 'B';
            else side = 'F';

            clip = Resources.Load<HapticClip>("All Colliders/" + side + gameObject.transform.parent.name + gameObject.name);
        }

        private void OnTriggerEnter(Collider other) {
            if(other.CompareTag("NPC") || other.CompareTag("Wall")) Play();
        }

        private void OnTriggerExit(Collider other) {
            Stop();
        }

        private void Play(){
            activated = true;
            StartCoroutine(PlayCoroutine());
        }

        private void Stop(){
            activated = false;
            //Debug.Log("parou - " + side + gameObject.transform.parent.name + gameObject.name);
            clip.Stop("" + side + gameObject.transform.parent.name + gameObject.name);
        }

        private IEnumerator PlayCoroutine(){
            //intensity, duration, AngleX, OffsetY
            clip.Play(.5f, 1f, 0f, 0f, "" + side + gameObject.transform.parent.name + gameObject.name);
            yield return new WaitForSecondsRealtime(.9f);
            
            if(activated) yield return PlayCoroutine();
            else yield return null;
        }
    }
}