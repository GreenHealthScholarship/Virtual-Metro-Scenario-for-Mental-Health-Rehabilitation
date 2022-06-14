using UnityEngine.Audio;
using UnityEngine;

[System.Serializable]
public class Sound
{

    public string name;

    public AudioClip clip;

    public bool loop;

    [Range(0f, 1f)]
    public float volume = 1f;
    [Range(.1f, 3f)]
    public float pitch = 1f;
    [Range(0f, 1f)]
    public float spatialBlend = 0f;

    public float minDistance = 1f;
    public float maxDistance = 500f;

    [HideInInspector]
    public AudioSource source;

}
