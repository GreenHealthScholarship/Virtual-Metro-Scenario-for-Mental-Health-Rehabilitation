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
            //Debug.Log(gameObject.transform.parent.transform.parent.name + gameObject.transform.parent.name + gameObject.name);
            if(other.gameObject.tag == "NPC" || other.gameObject.tag == "Wall"){
                Play();
            }
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
            clip.Stop("" + side + gameObject.transform.parent.name + gameObject.name);
        }

        private IEnumerator PlayCoroutine(){
            //intensity, duration, AngleX, OffsetY
            clip.Play(1f, 1f, 0f, 0f, "" + side + gameObject.transform.parent.name + gameObject.name);
            yield return new WaitForSecondsRealtime(.9f);
            //Debug.Log("Aqui");
            
            if(activated) yield return PlayCoroutine();
            else yield return null;
        }
    }
}